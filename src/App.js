import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Category from './modules/categories/Category';
import Manufacturer from './modules/manufacturers/Manufacturer';
import Series from './modules/series/Series';
import Models from './modules/models/Models';
import Alternatives from './modules/models/Alternatives';
import SkuSearchResults from './modules/sku/SkuSearchResults';
import TabNav from './components/tabnav/TabNav';
import Footer from './components/footer/Footer';
import Home from './pages/Home';
import categoriesData from './modules/categories/categories.json';
import manufacturersData from './modules/manufacturers/manufacturers.json';
import seriesData from './modules/series/series.json';
import './App.css';

const App = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');
  const [category, setCategory] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [manufacturerName, setManufacturerName] = useState('');
  const [manufacturerLogo, setManufacturerLogo] = useState('');
  const [series, setSeries] = useState('');
  const [model, setModel] = useState('');
  const [categoryName, setCategoryName] = useState('Select One');
  const [seriesName, setSeriesName] = useState('Select One');
  const [modelName, setModelName] = useState('Select One');

  useEffect(() => {
    const savedState = localStorage.getItem('appState');
    if (savedState) {
      const {
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
      } = JSON.parse(savedState);

      setActiveTab(activeTab);
      setCategory(category);
      setManufacturer(manufacturer);
      setManufacturerName(manufacturerName);
      setManufacturerLogo(manufacturerLogo);
      setSeries(series);
      setModel(model);
      setCategoryName(categoryName);
      setSeriesName(seriesName);
      setModelName(modelName);
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
    };
    localStorage.setItem('appState', JSON.stringify(state));
  }, [activeTab, category, manufacturer, manufacturerName, manufacturerLogo, series, model, categoryName, seriesName, modelName]);

  const handleSelectCategory = (category) => {
    setCategory(category.code);
    setCategoryName(category.name);
    setManufacturer('');
    setSeries('');
    setModel('');
    setManufacturerName('Select One');
    setSeriesName('Select One');
    setModelName('Select One');
    setActiveTab('category');
    navigate(`/${category.code}`);
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
    navigate(`/${categoryCode}/${manufacturer.code}`);
  };

  const handleSelectSeries = (categoryCode, manufacturerCode, seriesId) => {
    const seriesObj = seriesData.series.find(series => series.id === parseInt(seriesId));
    setSeries(seriesId);
    setSeriesName(seriesObj.name);
    setModel('');
    setModelName('Select One');
    setActiveTab('model');
    navigate(`/${categoryCode}/${manufacturerCode}/${seriesId}`);
  };

  const handleSelectModel = (model) => {
    setModel(model.id);
    setModelName(model.name);
    setActiveTab('alternative');
    navigate(`/${category}/${manufacturer}/${series}/${model.id}/alternatives`);
  };

  const handleSkuSelectModel = (model) => {
    const category = categoriesData.categories.find(category =>
      category.id === model.categoryId
    );
    const manufacturer = manufacturersData.manufacturers.find(manufacturer =>
      manufacturer.id === model.manufacturerId
    );
    const series = seriesData.series.find(series =>
      series.id === model.seriesId
    );

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
      setActiveTab('alternative');
      navigate(`/${category.code}/${manufacturer.code}/${series.id}/${model.id}/alternatives`);
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
      navigate('/categories');
    } else if (tab === 'manufacturer' && category) {
      setActiveTab('manufacturer');
      setManufacturer('');
      setManufacturerName('Select One');
      setSeries('');
      setSeriesName('Select One');
      setModel('');
      setModelName('Select One');
      navigate(`/${category}`);
    } else if (tab === 'series' && manufacturer) {
      setActiveTab('series');
      setSeries('');
      setSeriesName('Select One');
      setModel('');
      setModelName('Select One');
      navigate(`/${category}/${manufacturer}`);
    } else if (tab === 'model' && series) {
      setActiveTab('model');
      setModel('');
      setModelName('Select One');
      navigate(`/${category}/${manufacturer}/${series}`);
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
    setActiveTab('home');
    localStorage.removeItem('appState');
  };

  const isTabNavVisible = () => {
    return activeTab !== 'home';
  };

  return (
    <div className="content-with-footer">
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
      <Routes>
        <Route path="/" element={<Home onSelectCategory={() => { resetSelections(); setActiveTab('category'); navigate('/categories'); }} />} />
        <Route path="/categories" element={<Category onSelect={handleSelectCategory} />} />
        <Route path="/:categoryCode" element={<Manufacturer onSelectManufacturer={handleSelectManufacturer} />} />
        <Route path="/:categoryCode/:manufacturerCode" element={<Series manufacturerName={manufacturerName} manufacturerLogo={manufacturerLogo} onSelectSeries={handleSelectSeries} />} />
        <Route path="/:categoryCode/:manufacturerCode/:seriesId" element={<Models onSelectModel={handleSelectModel} />} />
        <Route path="/:categoryCode/:manufacturerCode/:seriesId/:modelId/alternatives" element={<Alternatives onRestart={resetSelections} />} />
        <Route path="/sku/:sku" element={<SkuSearchResults onSelectModel={handleSkuSelectModel} />} />
      </Routes>
      <Footer onRestart={resetSelections} />
    </div>
  );
};

export default App;