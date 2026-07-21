import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Alternatives.css';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import QRious from 'qrious';
import { IS_LOCAL } from '../../config';
import { dataPromise } from '../../utils/api';
import { fetchAPI } from '../../utils/fetchApi';

const fetchHaywardProduct = async (sku) => {
  try {
    const response = await fetch(
      `/rest/default/V1/products/${sku}`,
      {
        headers: {
          Authorization: "Bearer iufd84gliclfk6nqi0dy68agkcc2in52",
        },
      }
    );
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Fetch error: ", error);
    throw error;
  }
};

const truncateDescription = (description, maxLength) => {
  if (description.length <= maxLength) return description;
  return description.slice(0, maxLength) + '...';
};

const Alternatives = ({ onRestart }) => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const modelId = params.get('model');
  const seriesId = params.get('series');
  const navigate = useNavigate();

  const [relatedModels, setRelatedModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [model, setModel] = useState(null);
  const [series, setSeries] = useState(null);
  const [category, setCategory] = useState(null);
  const [manufacturer, setManufacturer] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const preloadedData = await dataPromise;
        // Fetch categories
       
      
        // Find the selected model
        const query = buildQuery([
          { field: "model_id", value: modelId, condition_type: "eq" },
        ]);
        const modelsResponse = await fetchAPI('models', query);
        const selectedModel = modelsResponse.models?.[0];
        setModel(selectedModel);

        const category = preloadedData.categories.find(category => parseInt(category.id) === parseInt(selectedModel.categoryId));
        setCategory(category || []);
        
        const manufacturer = preloadedData.manufacturers.find(manufacturer => parseInt(manufacturer.id) === parseInt(selectedModel.manufacturerId));
        setManufacturer(manufacturer || []);
        
        const selectedSeries= preloadedData.series.find(series => parseInt(series.id) === parseInt(seriesId));
        setSeries(selectedSeries);


        const results = await Promise.all(
          ['best', 'better', 'good'].map(async key => {
            const sku = selectedModel.relatedModels[key];
            if (sku && sku.trim()) {
              try {
                if (IS_LOCAL) {
                  const result = mockData[sku.trim()];
                  if (!result) {
                    throw new Error('Please try other product');
                  }
                  return { key, result };
                } else {
                  const result = await fetchHaywardProduct(sku.trim());
                  if (!result) {
                    throw new Error('Please try other product');
                  }
                  return { key, result }; // Ajustado para la nueva estructura de respuesta
                }
              } catch (err) {
                return { key, error: err.message };
              }
            }
            return null;
          })
        );

        const filteredResults = results.filter(result => result !== null);
        if (filteredResults.length === 0) {
          throw new Error('No related models found.');
        }

        // Rearrange the results based on availability
        const finalResults = { best: null, better: null, good: null };
        filteredResults.forEach(item => {
          if (item.key === 'best') finalResults.best = item;
          if (item.key === 'better') finalResults.better = item;
          if (item.key === 'good') finalResults.good = item;
        });

        // Adjust the positions
        if (!finalResults.best && finalResults.better) {
          finalResults.best = { ...finalResults.better, key: 'best' };
          finalResults.better = finalResults.good ? { ...finalResults.good, key: 'better' } : null;
          finalResults.good = null;
        }

        if (!finalResults.best && finalResults.good) {
          finalResults.best = { ...finalResults.good, key: 'best' };
          finalResults.good = null;
        }

        if (!finalResults.better && finalResults.good) {
          finalResults.better = { ...finalResults.good, key: 'better' };
          finalResults.good = null;
        }

        setRelatedModels([finalResults.best, finalResults.better].filter(item => item !== null));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [modelId]);

  const buildQuery = (params) => {
    const searchParams = new URLSearchParams();
    params.forEach(({ field, value, condition_type }, index) => {
      searchParams.append(`searchCriteria[filterGroups][${index}][filters][0][field]`, field);
      searchParams.append(`searchCriteria[filterGroups][${index}][filters][0][value]`, value);
      searchParams.append(`searchCriteria[filterGroups][${index}][filters][0][condition_type]`, condition_type);
    });
    return searchParams.toString();
  };
  
  useEffect(() => {
    if (model) {
      if (category && manufacturer && series) {
        navigate(`/?tab=alternative&category=${category.code}&manufacturer=${manufacturer.code}&series=${series.id}&model=${model.id}&sku=${model.sku}`);
      }
    }
  }, [model, navigate]);

  const createPdfStructure = async () => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const content = document.getElementById('pdf-content');

    pdf.setFontSize(18);
    pdf.text('Hayward Best-in-Class Options', 10, 20);

    const canvas = await html2canvas(content, {
      ignoreElements: (element) => element.classList.contains('no-print')
    });
    const imgData = canvas.toDataURL('image/png');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', 0, 30, pdfWidth, pdfHeight);

    const qr = new QRious({
      value: window.location.href,
      size: 100
    });
    const qrImage = qr.toDataURL('image/jpeg');

    pdf.addImage(qrImage, 'JPEG', pdf.internal.pageSize.getWidth() - 40, pdf.internal.pageSize.getHeight() - 40, 30, 30);

    pdf.save('hayward-alternatives.pdf');
  };

  if (loading) {
    return <div class="text-center">Loading...</div>;
  }

  if (error) {
    return <div class="text-center">Error: {error}</div>;
  }

  return (
    <div className="alternatives-container">
      <h2 className='title mt-3 mb-5'>Our Best-in-Class Options</h2>
      
      <div id="pdf-content">
        <div className="flex-container">
          {relatedModels.map(({ key, result, error }, index) => {
            if (error) {
              return (
                <div key={index} className={`col-12 col-md-3 model-card ${key} d-flex flex-wrap justify-content-center`}>
                  <h3 className='d-flex justify-content-center align-items-center'>{key.charAt(0).toUpperCase() + key.slice(1)}</h3>
                  <p>{error}</p>
                </div>
              );
            }

            const descriptionAttribute = result.custom_attributes.find(attr => attr.attribute_code === 'marketing_short_description');
            const description = descriptionAttribute ? descriptionAttribute.value : 'No description available';
            const truncatedDescription = truncateDescription(description, 150);
            const productUrl = `${window.location.origin}/${result.custom_attributes.find(attr => attr.attribute_code === 'url_key')?.value || '#'}.html`;

            return (
              <div key={index} className={`col-12 col-md-3 model-card ${key} d-flex flex-wrap justify-content-center`}>
                <h3 className='d-flex justify-content-center align-items-center'>{key.charAt(0).toUpperCase() + key.slice(1)}</h3>
                <img src={`/media/catalog/product/${result.media_gallery_entries[0]?.file}`} alt={result.name} className="img-fluid" />
                <h4>{result.name}</h4>
                <p>SKU: {result.sku}</p>
                <p className='description'>{truncatedDescription}</p>
                <a 
                  className='rounded-pill' 
                  href={productUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  View Details
                </a>
              </div>
            );
          })}
        </div>
        <div className='col-12 d-flex justify-content-center hide no-print'>
          <button onClick={createPdfStructure} className="btn btn-light rounded-pill px-5 py-3 my-3">
            Download PDF
            <img src="/media/wysiwyg/cms/tools/cross-reference/print.png" alt="Print" className="ms-3" style={{ width: '16px', height: '16px' }} />
          </button>
        </div>
        <div className="col-12 p-5 mt-4 bg-light d-flex flex-wrap">
        <h3 className='w-100'>Current Product to Replace</h3>
          <p className='w-100'>The product you wish to replace is shown below. We have listed on top the alternatives for your selection</p>
          <div className='d-flex align-items-center'>
            <img src={manufacturer?.logo} alt={manufacturer?.name} className="manufacturer-logo p-3 bg-white rounded shadow-sm mb-3"/>
          </div>
          <div className='d-flex flex-column justify-content-center ps-3 flex-fill'>
            <p className='m-0'><strong>Category:</strong> {category?.name}</p>
            <p className='m-0'><strong>Manufacturer:</strong> {manufacturer?.name}</p>
            <p className='m-0'><strong>Series:</strong> {series?.name}</p>
            <p className='m-0'><strong>Model:</strong> {model?.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alternatives;