import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Category from './modules/categories/Category';
import Manufacturer from './modules/manufacturers/Manufacturer';
import Series from './modules/series/Series';
import Models from './modules/models/Models';
import Alternatives from './modules/models/Alternatives';
import SkuSearchResults from './modules/sku/SkuSearchResults';
import TabNav from './components/tabnav/TabNav';
import Footer from './components/footer/Footer';
import Home from './pages/Home';
import './App.css';

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState('home');
  const [category, setCategory] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [manufacturerName, setManufacturerName] = useState('Select One');
  const [manufacturerLogo, setManufacturerLogo] = useState('');
  const [series, setSeries] = useState('');
  const [model, setModel] = useState('');
  const [sku, setSku] = useState('');
  const [categoryName, setCategoryName] = useState('Select One');
  const [seriesName, setSeriesName] = useState('Select One');
  const [modelName, setModelName] = useState('Select One');
  const [isBannerShrink, setIsBannerShrink] = useState(false); // Estado para controlar el tamaño del banner

  const [modelData, setModelData] = useState([]);
  const [manufacturerData, setManufacturerData] = useState(null);
  const [categoryData, setCategoryData] = useState(null);
  const [seriesData, setSeriesData] = useState(null);

  useEffect(() => {
    console.log('Loading state from localStorage');
    const savedState = localStorage.getItem('appState');
    console.log(savedState);

    if (savedState) {
      console.log('Loading state from localStorage');
      const parsedState = JSON.parse(savedState);

      setActiveTab(parsedState.activeTab || 'home');
      setCategory(parsedState.category || '');
      setCategoryName(parsedState.categoryName || 'Select One');
      setManufacturer(parsedState.manufacturer || '');
      setManufacturerName(parsedState.manufacturerName || 'Select One');
      setManufacturerLogo(parsedState.manufacturerLogo || '');
      setSeries(parsedState.series || '');
      setSeriesName(parsedState.seriesName || 'Select One');
      setModel(parsedState.model || '');
      setModelName(parsedState.modelName || 'Select One');
      setSku(parsedState.sku || '');
    }else{
      console.log(' from localStorage');
    }
  }, []);

  useEffect(() => {
      const state = {
        activeTab,
        category,
        manufacturer,
        manufacturerName,
        manufacturerLogo,
        series,
        model,
        categoryName,
        seriesName,
        modelName,
        sku,
      };
      localStorage.setItem('appState', JSON.stringify(state));
  }, [activeTab, category, manufacturer, manufacturerName, manufacturerLogo, series, model, categoryName, seriesName, modelName, sku]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    const categoryParam = params.get('category');
    const manufacturerParam = params.get('manufacturer');
    const seriesParam = params.get('series');
    const modelParam = params.get('model');
    const skuParam = params.get('sku');

    if (tab) setActiveTab(tab);
    if (categoryParam) setCategory(categoryParam);
    if (manufacturerParam) setManufacturer(manufacturerParam);
    if (seriesParam) setSeries(seriesParam);
    if (modelParam) setModel(modelParam);
    if (skuParam) setSku(skuParam);

    // Controlar el tamaño del banner
    if (tab && tab !== 'home') {
      setIsBannerShrink(true);
    } else {
      setIsBannerShrink(false);
    }
  }, [location]);


  const handleSelectCategory = (category) => {
    setCategory(category.code);
    setCategoryName(category.name);
    setManufacturer('');
    setSeries('');
    setModel('');
    setManufacturerName('Select One');
    setSeriesName('Select One');
    setModelName('Select One');
    setActiveTab('manufacturer');
    navigate(`/?tab=manufacturer&category=${category.code}`);

   
  };

  const handleSelectManufacturer = (categoryCode, manufacturer) => {
    setManufacturer(manufacturer.code);
    setManufacturerName(manufacturer.name);
    setManufacturerLogo(manufacturer.logo);
    setSeries('');
    setModel('');
    setSeriesName('Select One');
    setModelName('Select One');
    setActiveTab('series');
    navigate(`/?tab=series&category=${categoryCode}&manufacturer=${manufacturer.code}`);

   
  };

  const handleSelectSeries = (categoryCode, manufacturerCode, series, manufacturer) => {
    if (!manufacturer || !series) {
      console.error("Manufacturer or series not found");
      return;
    }

    setManufacturer(manufacturer.code);
    setManufacturerName(manufacturer.name);
    setManufacturerLogo(manufacturer.logo);
    setSeries(series.id);
    setSeriesName(series.name);
    setModel('');
    setModelName('Select One');
    setActiveTab('model');
    navigate(`/?tab=model&category=${categoryCode}&manufacturer=${manufacturerCode}&series=${series.id}`);

 
  };

  const handleSelectModel = (model,category,manufacturer,series) => {
  
    if (category && manufacturer && series) {
      setModelData(model);
      setCategoryData(category);
      setManufacturerData(manufacturer);
      setSeriesData(series);

      setCategory(category.code);
      setCategoryName(category.name);
      setManufacturer(manufacturer.code);
      setManufacturerName(manufacturer.name);
      setManufacturerLogo(manufacturer.logo);
      setSeries(series.id);
      setSeriesName(series.name);
      setModel(model.id);
      setModelName(model.name);
      setSku(model.sku);
      setActiveTab('alternative');
      navigate(`/?tab=alternative&category=${category.code}&manufacturer=${manufacturer.code}&series=${series.id}&model=${model.id}&sku=${model.sku}`);

    } else {
      console.error("One of the necessary data is missing (category, manufacturer, series)");
    }
  };

  const handleSkuSelectModel = (model, categoriesData,manufacturersData, seriesData) => {

    const category = categoriesData.find(category => parseInt(category.id) === parseInt(model.categoryId));
    const manufacturer = manufacturersData.find(manufacturer => parseInt(manufacturer.id) === parseInt(model.manufacturerId));
    const series = seriesData.find(series => parseInt(series.id) === parseInt(model.seriesId));

    if (category && manufacturer && series) {
      setCategory(category.code);
      setCategoryName(category.name);
      setManufacturer(manufacturer.code);
      setManufacturerName(manufacturer.name);
      setManufacturerLogo(manufacturer.logo);
      setSeries(series.id);
      setSeriesName(series.name);
      setModel(model.id);
      setModelName(model.name);
      setSku(model.sku);
      setActiveTab('alternative');
      navigate(`/?tab=alternative&category=${category.code}&manufacturer=${manufacturer.code}&series=${series.id}&model=${model.id}&sku=${model.sku}`);

    }
  };

  const handleTabClick = (tab) => {
    if (tab === 'category') {
      setActiveTab('category');
      setCategory('');
      setCategoryName('Select One');
      setManufacturer('');
      setManufacturerName('Select One');
      setSeries('');
      setSeriesName('Select One');
      setModel('');
      setModelName('Select One');
      navigate('/?tab=category');
    } else if (tab === 'manufacturer') {
      if (category) {
        setActiveTab('manufacturer');
        setManufacturer('');
        setManufacturerName('Select One');
        setSeries('');
        setSeriesName('Select One');
        setModel('');
        setModelName('Select One');
        navigate(`/?tab=manufacturer&category=${category}`);
      } else {
        console.error("Category is not selected");
      }
    } else if (tab === 'series' && manufacturer) {
      setActiveTab('series');
      setSeries('');
      setSeriesName('Select One');
      setModel('');
      setModelName('Select One');
      navigate(`/?tab=series&category=${category}&manufacturer=${manufacturer}`);
    } else if (tab === 'model' && series) {
      setActiveTab('model');
      setModel('');
      setModelName('Select One');
      navigate(`/?tab=model&category=${category}&manufacturer=${manufacturer}&series=${series}`);
    } else if (tab === 'sku' && sku) {
      setActiveTab('sku');
      navigate(`/?tab=sku&sku=${sku}`);
    }
  };

  const resetSelections = () => {
    setCategory('');
    setCategoryName('Select One');
    setManufacturer('');
    setManufacturerName('Select One');
    setManufacturerLogo('');
    setSeries('');
    setSeriesName('Select One');
    setModel('');
    setModelName('Select One');
    setSku('');
    setActiveTab('home');
    localStorage.removeItem('appState');
    navigate('/');
  };

  const isTabNavVisible = () => {
    return activeTab !== 'home';
  };

  const renderComponent = () => {
    switch (activeTab) {
      case 'category':
        return <Category onSelect={handleSelectCategory} />;
        case 'manufacturer':
          return <Manufacturer onSelectManufacturer={handleSelectManufacturer} />;
        case 'series':
          return (
            <Series
              onSelectSeries={handleSelectSeries}
              manufacturerLogo={manufacturerLogo}
              manufacturerName={manufacturerName}
            />
          );
        case 'model':
          return (
            <Models
              onSelectModel={handleSelectModel}
              manufacturerLogo={manufacturerLogo}
              manufacturerName={manufacturerName}
            />
          );
        case 'alternative':
          return <Alternatives 
           onRestart={resetSelections} />;
        case 'sku':
          return <SkuSearchResults onSelectModel={handleSkuSelectModel} />;
        default:
          return <Home onSelectCategory={() => { resetSelections(); setActiveTab('category'); navigate('/?tab=category'); }} />;
      }
    };
  
    return (
      <>
        <header className={`banner ${isBannerShrink ? 'banner-shrink' : ''}`}>
          <div className="banner-content">
            <h2 className="text-white">Cross-Reference</h2>
            {activeTab === 'home' ? (
              <p className="text-white">
                Replacing a piece of equipment by another brand? <br></br>
                Discover the best pool product offering from Hayward that drop into your application!
              </p>
            ) : (
              <button className="btn btn-dark mt-3 px-4 py-2 rounded-pill" onClick={resetSelections}>
                Start Again
              </button>
            )}
          </div>
        </header>
  
        <div className="content content-with-footer">
          {isTabNavVisible() && (
            <TabNav
              activeTab={activeTab}
              category={category}
              manufacturer={manufacturer}
              series={series}
              model={model}
              categoryName={categoryName}
              manufacturerName={manufacturerName}
              seriesName={seriesName}
              modelName={modelName}
              setActiveTab={setActiveTab}
              handleTabClick={handleTabClick}
            />
          )}
          {renderComponent()}
          <Footer onRestart={resetSelections} />
        </div>
      </>
    );
  };
  
  export default App;