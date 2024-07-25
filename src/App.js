import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Category from './modules/categories/Category';
import Manufacturer from './modules/manufacturers/Manufacturer';
import Series from './modules/series/Series';
import Models from './modules/models/Models';
import Alternatives from './modules/models/Alternatives';
import TabNav from './components/tabnav/TabNav';
import Footer from './components/footer/Footer';
import categoriesData from './modules/categories/categories.json';
import manufacturersData from './modules/manufacturers/manufacturers.json';
import seriesData from './modules/series/series.json';
import './App.css';

const Home = ({ onSelectCategory }) => (
  <div className="App">
    <Category categories={categoriesData.categories} onSelect={onSelectCategory} />
  </div>
);

const App = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('category');
  const [category, setCategory] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [series, setSeries] = useState('');
  const [model, setModel] = useState('');
  const [categoryName, setCategoryName] = useState('Select One');
  const [manufacturerName, setManufacturerName] = useState('Select One');
  const [seriesName, setSeriesName] = useState('Select One');
  const [modelName, setModelName] = useState('Select One');

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
    navigate(`/cross-reference/${category.code}`);
  };

  const handleSelectManufacturer = (categoryCode, manufacturerCode) => {
    const manufacturerObj = manufacturersData.manufacturers.find(manufacturer => manufacturer.code === manufacturerCode);
    setManufacturer(manufacturerCode);
    setManufacturerName(manufacturerObj.name);
    setSeries('');
    setModel('');
    setSeriesName('Select One');
    setModelName('Select One');
    setActiveTab('series');
    navigate(`/cross-reference/${categoryCode}/${manufacturerCode}`);
  };

  const handleSelectSeries = (categoryCode, manufacturerCode, seriesId) => {
    const seriesObj = seriesData.series.find(series => series.id === parseInt(seriesId));
    setSeries(seriesId);
    setSeriesName(seriesObj.name);
    setModel('');
    setModelName('Select One');
    setActiveTab('model');
    navigate(`/cross-reference/${categoryCode}/${manufacturerCode}/${seriesId}`);
  };

  const handleSelectModel = (model) => {
    setModel(model.id);
    setModelName(model.name);
    setActiveTab('alternative');
    navigate(`/cross-reference/${category}/${manufacturer}/${series}/${model.id}/alternatives`);
  };

  const handleTabClick = (tab) => {
    if (tab === 'category') {
      resetSelections();
      navigate('/cross-reference/');
    } else if (tab === 'manufacturer' && category) {
      setActiveTab('manufacturer');
      setManufacturer('');
      setManufacturerName('Select One');
      setSeries('');
      setSeriesName('Select One');
      setModel('');
      setModelName('Select One');
      navigate(`/cross-reference/${category}`);
    } else if (tab === 'series' && manufacturer) {
      setActiveTab('series');
      setSeries('');
      setSeriesName('Select One');
      setModel('');
      setModelName('Select One');
      navigate(`/cross-reference/${category}/${manufacturer}`);
    } else if (tab === 'model' && series) {
      setActiveTab('model');
      setModel('');
      setModelName('Select One');
      navigate(`/cross-reference/${category}/${manufacturer}/${series}`);
    }
  };

  const resetSelections = () => {
    setActiveTab('category');
    setCategory('');
    setCategoryName('Select One');
    setManufacturer('');
    setManufacturerName('Select One');
    setSeries('');
    setSeriesName('Select One');
    setModel('');
    setModelName('Select One');
  };

  return (
    <div className="content-with-footer">
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
      <Routes>
        <Route path="/cross-reference/" element={<Home onSelectCategory={handleSelectCategory} />} />
        <Route path="/cross-reference/:categoryCode" element={<Manufacturer onSelectManufacturer={handleSelectManufacturer} />} />
        <Route path="/cross-reference/:categoryCode/:manufacturerCode" element={<Series onSelectSeries={handleSelectSeries} />} />
        <Route path="/cross-reference/:categoryCode/:manufacturerCode/:seriesId" element={<Models onSelectModel={handleSelectModel} />} />
        <Route path="/cross-reference/:categoryCode/:manufacturerCode/:seriesId/:modelId/alternatives" element={<Alternatives onRestart={resetSelections} />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;