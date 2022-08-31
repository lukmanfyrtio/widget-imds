import React, { useEffect, useState } from 'react';
import './App.css';
import { Chart, registerables } from 'chart.js';
import { Line } from 'react-chartjs-2';

import { over } from 'stompjs';
import SockJS from 'sockjs-client';

Chart.register(...registerables);
function App({ domElement }) {
  const widgetType = domElement.getAttribute("type")
  const kode_efek = domElement.getAttribute("kodeefek")
  var stompClient = null;
  const [chartData, setChartData] = useState({
    kode_efek: kode_efek,
    openPrice: '',
    lowPrice: '',
    highPrice: '',
    prevPrice: '',
    lastPriceValue: '',
    lastUpdate: '',

  });

  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (kode_efek) {
      if (connected == false) {
        console.log("Trying connect")
        connect();
      }
    }
  }, [connected])

  const connect = () => {
    let Sock = new SockJS('http://localhost:91/ws');
    stompClient = over(Sock);
    stompClient.connect({}, onConnected, onError);
  }

  const onConnected = () => {
    setConnected(true);
    stompClient.subscribe('/user/' + chartData.kode_efek + '/price', onGetDataChart);
  }

  const onGetDataChart = (payload) => {
    var payloadData = JSON.parse(payload.body);
    console.log(payloadData)
    setChartData({
      kode_efek: payloadData.kodeEfek,
      openPrice: payloadData.openPrice,
      lowPrice: payloadData.lowPrice,
      highPrice: payloadData.highPrice,
      prevPrice: payloadData.prevPrice,
      lastPriceValue: payloadData.lastPriceValue,
      lastUpdate: payloadData.lastUpdate,
    })
  }

  const onError = (err) => {
    console.log("Can't connected to websocket")
    setConnected(false);
    console.log(err);

  }

  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Price",
        data: [33, 53, 85, 41, 44, 65, 33, 53, 85, 41, 44, 65],
        fill: true,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)"
      }
    ]
  };

  const optionHorizontal = {
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false,
          position: "bottom",
        },
      },
    },
  };

  return (
    <div className="main-widget">
      {widgetType === "xml-feeder" ?
        <div className='xml-feeder'>
          <div className='column'>
            <label className="xml-feeder-title">{chartData.kode_efek}</label>
            <label className='xml-feeder-price'>{chartData.prevPrice}</label>
            <div className='xml-feeder-content column'>
              <div className='xml-feeder-item'>
                <label>Open</label>
                <label>{chartData.openPrice}</label>
              </div>
              <div className='xml-feeder-item'>
                <label>High</label>
                <label>{chartData.highPrice}</label>
              </div>
              <div className='xml-feeder-item'>
                <label>Low</label>
                <label>{chartData.lowPrice}</label>
              </div>
              <div className='xml-feeder-item br-bottom'>
                <label>Volume</label>
                <label>{chartData.lastPriceValue}</label>
              </div>
            </div>
            <div className='xml-feeder-footer row'>
              <label>{chartData.lastUpdate}</label>
            </div>
          </div>
        </div>
        : widgetType === "news" ?
          <div className='news-announcement'>
            <div className='news-announcement-tab row'>
              <div className='news-announcement-year'>2022</div>
              <div className='news-announcement-year'>2021</div>
              <div className='news-announcement-year'>2020</div>
            </div>
            <div className='news-announcement-header row'>
              <div className='news-announcement-header-title'>Title</div>
              <div className='news-announcement-header-date'>Date</div>
            </div>
            <div className='news-announcement-list'>
              <div className='news-announcement-item'>
                <div className='news-announcement-item-title'>Material Information or Facts Report GARUDA INDONESIA GETS APPROVAL OF MAJORITY OF CREDITORS ON PKPU COMPOSITION PLAN</div>
                <div className='news-announcement-item-date'>20 Nov 2021</div>
              </div>
              <div className='news-announcement-item'>
                <div className='news-announcement-item-title'>Material Information or Facts Report GARUDA INDONESIA GETS APPROVAL OF MAJORITY OF CREDITORS ON PKPU COMPOSITION PLAN</div>
                <div className='news-announcement-item-date'>20 Nov 2021</div>
              </div>
              <div className='news-announcement-item'>
                <div className='news-announcement-item-title'>Material Information or Facts Report GARUDA INDONESIA GETS APPROVAL OF MAJORITY OF CREDITORS ON PKPU COMPOSITION PLAN</div>
                <div className='news-announcement-item-date'>20 Nov 2021</div>
              </div>
            </div>
          </div>
          : widgetType === "chart" ?
            <div className='chart-price'>
              <div className='chart-price-tab-filter row'>
                <div className='chart-price-tab-item'>5D</div>
                <div className='chart-price-tab-item'>1M</div>
                <div className='chart-price-tab-item'>3M</div>
                <div className='chart-price-tab-item'>6M</div>
                <div className='chart-price-tab-item'>1Y</div>
              </div>
              <div className='chart-price-content'>
                <Line data={data} options={optionHorizontal.options} />
              </div>
            </div> : ""}
    </div>

  );
}

export default App;