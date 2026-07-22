import json
import urllib.request
import urllib.parse
import urllib.error

def lambda_handler(event, context):
    if not isinstance(event, dict):
        event = {}
    query_params = event.get("queryStringParameters") or {}
    path_params = event.get("pathParameters") or {}
    event_path = (event.get("path") or "").strip("/")
    
    sku = query_params.get("sku") or path_params.get("sku") or ""
    path = query_params.get("path") or ""
    
    # Extract SKU from path if routed via /haywardProducts/HP50HA2
    if "haywardProducts/" in event_path:
        sku = event_path.split("haywardProducts/", 1)[-1]
        
    if not sku and not path:
        return {
            "statusCode": 400,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json"
            },
            "body": json.dumps({"error": "Missing 'sku' or 'path' parameter"})
        }
        
    is_product = bool(sku)
    
    if is_product:
        sku_clean = sku.strip("/")
        target_path = f"products/{sku_clean}"
        base_url = "https://hayward.com/rest/default/V1/"
        token = "2ybnsdi9kyu87h97ze850fq1kb607888"
        query_string = ""
    else:
        target_path = path.strip("/")
        if target_path.startswith("rest/V1/"):
            target_path = target_path[len("rest/V1/"):]
        target_path = target_path.strip("/")
        
        base_url = "https://hayward.com/rest/V1/"
        token = "3ci73owhvsyvefa3qu5nti1vevqi16d0"
        
        # Reconstruct query parameters (excluding path)
        clean_params = {k: v for k, v in query_params.items() if k != "path"}
        query_string = urllib.parse.urlencode(clean_params)
        
    full_url = f"{base_url}{target_path}"
    if query_string:
        full_url += f"?{query_string}"
        
    req = urllib.request.Request(full_url)
    req.add_header("Authorization", f"Bearer {token}")
    req.add_header("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
    
    try:
        with urllib.request.urlopen(req, timeout=10) as response:
            status_code = response.getcode()
            headers = {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json"
            }
            body = response.read().decode("utf-8")
            if is_product:
                try:
                    data = json.loads(body)
                    if isinstance(data, dict):
                        data.pop("price", None)
                    body = json.dumps(data)
                except Exception:
                    pass
            return {
                "statusCode": status_code,
                "headers": headers,
                "body": body
            }
    except urllib.error.HTTPError as he:
        print(f"HTTPError: {he.code} - {he.reason}")
        body_err = ""
        try:
            body_err = he.read().decode("utf-8") if he.fp else json.dumps({"error": str(he.reason)})
        except Exception as read_err:
            body_err = json.dumps({"error": str(he.reason), "read_error": str(read_err)})
        return {
            "statusCode": he.code,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json"
            },
            "body": body_err
        }
    except Exception as e:
        print(f"Exception: {str(e)}")
        import traceback
        traceback.print_exc()
        return {
            "statusCode": 500,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json"
            },
            "body": json.dumps({"error": str(e)})
        }
