import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Alternatives.css';
import modelsData from './models.json';
import mockData from './mockData.json';
import categoriesData from '../categories/categories.json';
import manufacturersData from '../manufacturers/manufacturers.json';
import seriesData from '../series/series.json';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import QRious from 'qrious';
import { IS_LOCAL } from '../../config';

const fetchHaywardProduct = async (sku) => {
  try {
    const response = await fetch(
      `https://hayward.com/rest/default/V1/products/${sku}`, // Simplificado para buscar directamente por SKU
      {
        headers: {
          Authorization: "Bearer 3b5kg5eu34t3gdmkiph3m1aqcgun8cu6",
        },
      }
    );

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const result = await response.json();
    return result; // Devuelve el resultado completo en lugar de `result.items[0]`
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
  const navigate = useNavigate();
  const [relatedModels, setRelatedModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const model = modelsData.models.find(model => model.id === parseInt(modelId));

  useEffect(() => {
    if (!model) {
      setLoading(false);
      setError('Model not found');
      return;
    }

    const fetchRelatedModels = async () => {
      try {
        const results = await Promise.all(
          ['best', 'better', 'good'].map(async key => {
            const sku = model.relatedModels[key];
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
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedModels();
  }, [model]);

  useEffect(() => {
    if (model) {
      const category = categoriesData.categories.find(category => category.id === model.categoryId);
      const manufacturer = manufacturersData.manufacturers.find(manufacturer => manufacturer.id === model.manufacturerId);
      const series = seriesData.series.find(series => series.id === model.seriesId);

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
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const category = categoriesData.categories.find(category => category.id === model.categoryId);
  const manufacturer = manufacturersData.manufacturers.find(manufacturer => manufacturer.id === model.manufacturerId);
  const series = seriesData.series.find(series => series.id === model.seriesId);

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
            const productUrl = `${window.location.origin}/${result.custom_attributes.find(attr => attr.attribute_code === 'url_key')?.value || '#'}-${result.sku}.html`;

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