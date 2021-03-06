import React, { useEffect, useRef, useState } from 'react';
import Chartjs from 'chart.js'

import { Row, Col } from 'antd'
import {Colour, Font, Text, Center, LabelGrey} from '../components'
import {convertToDate, prettify} from '../utils'

export const ChartStyles = {
    marginLeft:0,
    marginRight:50,
    marginTop:25,
    marginBottom:25,
    backgroundColor:Colour().black,
    height:400
  }

const getChartConfig = () => {
    return {
    type: 'bar',
    data: {
        labels: '',
        datasets: [{
            label: '',
            data: '',
            backgroundColor: 'rgba(255, 206, 86, 0.2)',
            borderColor: 'rgba(255, 206, 86, 1)',
            borderWidth: 1,
            yAxisID: "L"
        }]
    },
    options: {
        scales: {
            yAxes: [{
                id: "L",
                type: "linear",
                position: "left",
                ticks: {
                    beginAtZero: true,
                },
                scaleLabel: {
                    display: true,
                    labelString: "",
                    fontFamily: Font(),
                    fontSize:16
                },
                gridLines: {
                    display: true ,
                    color: Colour().dgrey,
                    zeroLineColor: Colour().dgrey
                  },
            }],
            xAxes: [{
                ticks: {
                    beginAtZero: true
                },
                scaleLabel: {
                    display: true,
                    labelString: "",
                    fontFamily: Font(),
                    fontSize:16
                },
                gridLines: {
                    display: false ,
                    color: Colour().dgrey,
                    zeroLineColor: Colour().dgrey
                  },
            }]
        },
        title: {
            display: true,
            text: '',
            fontFamily: Font(),
            padding:10,
            fontSize:20
        },
        legend: {
            display: false,
            position: "bottom",
            labels:{
                fontFamily: Font(),
            }
            
        },
        layout: {
            padding: {
                left: 10,
                right: 10,
                top: 10,
                bottom: 10
            }
        },
        responsive: true,
        maintainAspectRatio: false
    }
}}

const rightAxisConfig = () => {
    return {
    id: "R",
    type: "linear",
    position: "right",
    ticks: {
        beginAtZero: true,
    },
    scaleLabel: {
        display: true,
        labelString: "Total Ether",
        fontFamily: Font(),
        fontSize:16
    },
    gridLines: {
        display: false
      }
}}

export const ChartEther = (props) => {  

    const chartContainer = useRef(null)
    // eslint-disable-next-line
    const [chartInstance, setChartInstance] = useState(null)

    var chartConfig = getChartConfig()
    chartConfig.data.datasets[0].label = 'Ether Burnt'
    chartConfig.options.scales.yAxes[0].scaleLabel.labelString = 'Ether Burnt'
    chartConfig.options.scales.xAxes[0].scaleLabel.labelString = 'Day'
    chartConfig.options.title.text = 'Ether Burnt Daily'

    useEffect(() => {
        setUp()
        // eslint-disable-next-line
    }, [chartContainer])

    const setUp = async () => {
        if(chartContainer && chartContainer.current){
            const newChartInstance = new Chartjs(chartContainer.current, chartConfig)
            setChartInstance(newChartInstance)
            setChart(props.claimArray, newChartInstance)
        }
    }

    const setChart = (claimArray, newChartInstance) => {
        
        chartConfig.data.labels = claimArray.days
        chartConfig.data.datasets[0].data = claimArray.burns
        const dataset2 = {
            type: "line",
            label: "Total Burnt",
            data:claimArray.totals,
            backgroundColor: 'rgba(255, 206, 86, 0.2)',
            borderColor: 'rgba(255, 206, 86, 1)',
            borderWidth: 1,
            yAxisID: "R"
        }
        chartConfig.data.datasets.push(dataset2)
        chartConfig.options.scales.yAxes.push(rightAxisConfig())
        chartConfig.options.scales.yAxes[1].scaleLabel.labelString = 'Ether Burnt'
        newChartInstance.update()
    }

    return(
        <div style={ChartStyles}>
            <canvas ref={chartContainer} />
        </div>
    )
}

export const ChartClaim = (props) => {

    var chartConfig = getChartConfig()
    chartConfig.options.title.text = 'Vether Emitted Daily'
    chartConfig.data.datasets[0].label = 'Vether Unclaimed'
    chartConfig.options.scales.yAxes[0].scaleLabel.labelString = 'Vether'
    chartConfig.options.scales.xAxes[0].scaleLabel.labelString = 'Day'
    chartConfig.options.scales.xAxes[0].stacked = true
    chartConfig.options.scales.yAxes[0].stacked = false

    const chartContainer = useRef(null)
    // eslint-disable-next-line
    const [chartInstance, setChartInstance] = useState(null)

    useEffect(() => {
        setUp()
        // eslint-disable-next-line
    }, [chartContainer])

    const setUp = async () => {
        const timeDelay = 250;
        const delay = ms => new Promise(res => setTimeout(res, ms));
        await delay(timeDelay)
        if(chartContainer && chartContainer.current){
            const newChartInstance = new Chartjs(chartContainer.current, chartConfig)
            setChartInstance(newChartInstance)
            setChart(props.claimArray, newChartInstance)
        }
    }

    const setChart = async (claimArray, newChartInstance) => {
        chartConfig.data.labels = claimArray.days
        chartConfig.data.datasets[0].data = claimArray.unclaims
        const dataset2 = {
            label: "Emission",
            data:claimArray.emission,
            backgroundColor: 'rgba(255, 206, 86, 0.2)',
            borderColor: 'rgba(255, 206, 86, 1)',
            borderWidth: 1
        }
        chartConfig.data.datasets.push(dataset2)

        const dataset3 = {
            type: "line",
            label: "Planned Total",
            data:claimArray.vether,
            backgroundColor: 'rgba(255, 206, 86, 0.2)',
            borderColor: 'rgba(255, 206, 86, 1)',
            borderWidth: 1,
            yAxisID: "R"
        }
        chartConfig.data.datasets.push(dataset3)

        const dataset4 = {
            type: "line",
            label: "Actual Total",
            data:claimArray.claims,
            backgroundColor: 'rgba(255, 206, 86, 0.2)',
            borderColor: 'rgba(255, 206, 86, 1)',
            borderWidth: 1,
            yAxisID: "R"
        }
        chartConfig.data.datasets.push(dataset4)

        chartConfig.options.scales.yAxes.push(rightAxisConfig())
        chartConfig.options.scales.yAxes[1].scaleLabel.labelString = 'Vether Supply'
        newChartInstance.update()
    }

    return(
        <div style={ChartStyles}>
            <canvas ref={chartContainer} />
        </div>
    )
}

export const ChartDistro = (props) => {

    var chartConfig = getChartConfig()
    chartConfig.type = "bar"
    chartConfig.options.title.text = 'Vether Distribution'
    chartConfig.data.datasets[0].label = 'Member Ownership'
    chartConfig.options.scales.yAxes[0].scaleLabel.labelString = 'Vether (linear)'
    chartConfig.options.scales.xAxes[0].scaleLabel.labelString = 'Member'
    
    const dataset3 = {
        type: "line",
        label: "Ownership",
        data: '',
        fill: false,
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1,
        yAxisID: "R"
    }
    chartConfig.data.datasets.push(dataset3)
    chartConfig.options.scales.yAxes.push(rightAxisConfig())
    chartConfig.options.scales.yAxes[1].type = "logarithmic"
    chartConfig.options.scales.yAxes[1].scaleLabel.labelString = 'Vether (logarithmic)'

    const chartContainer = useRef(null)
    // eslint-disable-next-line
    const [chartInstance, setChartInstance] = useState(null)

    useEffect(() => {
        setUp()
        // eslint-disable-next-line
    }, [chartContainer])

    const setUp = async () => {
        const timeDelay = 500;
        const delay = ms => new Promise(res => setTimeout(res, ms));
        await delay(timeDelay)
        if(chartContainer && chartContainer.current){
            const newChartInstance = new Chartjs(chartContainer.current, chartConfig)
            setChartInstance(newChartInstance)
            setChart(props.holderArray, newChartInstance)
        }
    }

    const setChart = async (holderArray, newChartInstance) => {
        if(holderArray.length){
            let holderShip = holderArray
        .filter(item => convertFromWei(item.balance) < 10000)
        .filter(item => convertFromWei(item.balance) > 0.1)
        .map(item => convertFromWei(item.balance))
        let labels = []
        for(var i=1; i<=holderShip.length; i++){
            labels.push(i)
        }
        chartConfig.data.labels = labels
        chartConfig.data.datasets[0].data = holderShip
        chartConfig.data.datasets[1].data = holderShip
        newChartInstance.update()
        }  
    }

    function convertFromWei(number) {
        return number / 1000000000000000000
    }

    return(
        <div style={ChartStyles}>
            <canvas ref={chartContainer} />
        </div>
    )
}

export const ChartPie = (props) => {
    
    var chartConfig = getChartConfig()
    chartConfig.type = "pie"
    chartConfig.options.title.text = 'Vether Ownership'
    chartConfig.data.datasets[0].label = 'Member Ownership'
    chartConfig.options.scales.yAxes[0].scaleLabel.labelString = 'Vether'
    chartConfig.options.scales.xAxes[0].scaleLabel.labelString = 'Member'

    chartConfig.options.scales.yAxes[0].scaleLabel.display = false
    chartConfig.options.scales.yAxes[0].gridLines.display = false
    chartConfig.options.scales.xAxes[0].scaleLabel.display = false
    chartConfig.options.scales.xAxes[0].gridLines.display = false
    chartConfig.options.scales.yAxes[0].ticks.display = false
    chartConfig.options.scales.xAxes[0].ticks.display = false

    const chartContainer = useRef(null)
    // eslint-disable-next-line
    const [chartInstance, setChartInstance] = useState(null)

    useEffect(() => {
        setUp()
        // eslint-disable-next-line
    }, [chartContainer])

    const setUp = async () => {
        const timeDelay = 1000;
        const delay = ms => new Promise(res => setTimeout(res, ms));
        await delay(timeDelay)
        // const data =  await getHolderArray()
        if(chartContainer && chartContainer.current){
            const newChartInstance = new Chartjs(chartContainer.current, chartConfig)
            setChartInstance(newChartInstance)
            setChart(props.holderArray, newChartInstance)
        }
    }

    const setChart = async (holderArray, newChartInstance) => {
        let labels = []
        for(var i=1; i<=holderArray.length; i++){
        labels.push(i)
        let holderShip = holderArray
        .filter(item => convertFromWei(item.balance) < 10000)
        .map(item => convertFromWei(item.balance))
        chartConfig.data.labels = labels
        chartConfig.data.datasets[0].data = holderShip
        newChartInstance.update()
        }  
    }

    function convertFromWei(number) {
        return number / 1000000000000000000
    }

    return(
        <div style={ChartStyles}>
            <canvas ref={chartContainer} />
        </div>
    )
}

export const ChartEmission = (props) => {

    var chartConfig = getChartConfig()
    chartConfig.type = "line"
    chartConfig.data.labels = props.emissionArray.eras
    chartConfig.data.datasets[0].label = 'Total Supply'
    chartConfig.data.datasets[0].data = props.emissionArray.total
    chartConfig.options.scales.yAxes[0].scaleLabel.labelString = 'Vether'
    chartConfig.options.scales.xAxes[0].scaleLabel.labelString = 'Era'
    chartConfig.options.title.text = 'Vether Emission'

    const dataset2 = {
        type: "bar",
        label: "Era Emission",
        data:props.emissionArray.supply,
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1
    }
    chartConfig.data.datasets.push(dataset2)

    const chartContainer = useRef(null)
    // eslint-disable-next-line
    const [chartInstance, setChartInstance] = useState(null)

    useEffect(() => {
        if(chartContainer && chartContainer.current){
            const newChartInstance = new Chartjs(chartContainer.current, chartConfig)
            setChartInstance(newChartInstance)
        }
        // eslint-disable-next-line
    }, [chartContainer])

    return(
        <div style={ChartStyles}>
            <canvas ref={chartContainer} />
        </div>
    )
}

export const ChartData = (props) =>{

    const eraData = props.eraData
    const emissionData = props.emissionData
    const genesis = convertToDate(1589271741)
    const halving = convertToDate(eraData.nextEra)
    const end = convertToDate(1589271741 + 315360000)

    const paneStyles = {
        paddingLeft:10,
        paddingRight:10,
        paddingTop:10
    }
    const rowStyles = {
        paddingBottom:20
    }

    return(
        <div style={ChartStyles}>
            <div style={paneStyles}>
                <Center><LabelGrey size={18}>Vether Overview</LabelGrey></Center>

                <Row style={rowStyles}>
                    <Col xs={12}>
                        <LabelGrey size={props.size}>Total Holders</LabelGrey><br />
                        <Text size={1.25*props.size}>{props.holders} holders</Text>
                    </Col>
                    <Col xs={12}>
                        <LabelGrey size={props.size}>Total Transfers</LabelGrey><br />
                        <Text size={1.25*props.size}>{props.transfers} transfers</Text>
                    </Col>
                </Row>

                <Row style={rowStyles}>
                    <Col xs={12}>
                        <LabelGrey size={props.size}>Total Burnt</LabelGrey><br />
                        <Text size={1.25*props.size}>{prettify((+emissionData.totalBurnt).toFixed(2))} ETH</Text>
                    </Col>
                    <Col xs={12}>
                        <LabelGrey size={props.size}>Total Fees</LabelGrey><br />
                        <Text size={1.25*props.size}>{prettify((+emissionData.totalFees).toFixed(2))} VETH</Text>
                    </Col>
                    {/* <Col xs={8}>
                    </Col> */}
                </Row>

                <Row style={rowStyles}>
                    <Col xs={12}>
                        <LabelGrey size={props.size}>Current Emission</LabelGrey><br />
                        <Text size={1.25*props.size}>{eraData.emission} ETH</Text>
                    </Col>
                    <Col xs={12}>
                        <LabelGrey size={props.size}>Next Emission</LabelGrey><br />
                        <Text size={1.25*props.size}>{eraData.emission / 2} VETH</Text>
                    </Col>
                    {/* <Col xs={8}>
                    </Col> */}
                </Row>
                <Row style={rowStyles}>
                    <Col xs={8}>
                        <LabelGrey size={props.size}>Genesis</LabelGrey><br />
                        <Text size={1.25*props.size}>{genesis}</Text>
                    </Col>
                    <Col xs={8}>
                        <LabelGrey size={props.size}>Halving</LabelGrey><br />
                        <Text size={1.25*props.size}>{halving}</Text>
                    </Col>
                    <Col xs={8}>
                        <LabelGrey size={props.size}>Fully Emitted</LabelGrey><br />
                        <Text size={1.25*props.size}>{end}</Text>
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export const ChartPrice = (props) => {  

    const chartContainer = useRef(null)
    // eslint-disable-next-line
    const [chartInstance, setChartInstance] = useState(null)

    var chartConfig = getChartConfig()
    chartConfig.options.title.text = 'Vether Value'
    chartConfig.data.datasets[0].label = 'Daily Value'
    chartConfig.options.scales.yAxes[0].scaleLabel.labelString = 'Value (USD)'
    chartConfig.options.scales.xAxes[0].scaleLabel.labelString = 'Day'

    useEffect(() => {
        setUp()
        // eslint-disable-next-line
    }, [chartContainer])

    const setUp = async () => {
        if(chartContainer && chartContainer.current){
            const newChartInstance = new Chartjs(chartContainer.current, chartConfig)
            setChartInstance(newChartInstance)
            setChart(props.priceData, props.uniswapPrices, newChartInstance)
        }
    }

    const setChart = (priceData, uniswapPrices, newChartInstance) => {
        
        chartConfig.data.labels = props.days
        chartConfig.data.datasets[0].data = priceData.daily
        chartConfig.data.datasets[0].type = "line"
        chartConfig.options.scales.yAxes[0].position = 'right'
        // chartConfig.data.datasets[0].fill = false
        const dataset2 = {
            type: "line",
            label: "All Time Value",
            data:priceData.totals,
            backgroundColor: Colour('0.2').yellow,
            borderColor: Colour().yellow,
            borderWidth: 1,
            fill: false,
            yAxisID: "L"
        }
        chartConfig.data.datasets.push(dataset2)

        const dataset3 = {
            type: "line",
            label: "Uniswap Price",
            data:uniswapPrices,
            // backgroundColor: Colour('0.2').yellow,
            borderColor: Colour().white,
            borderWidth: 1,
            fill: false,
            yAxisID: "L"
        }
        chartConfig.data.datasets.push(dataset3)
        // chartConfig.options.scales.yAxes.push(rightAxisConfig())
        // chartConfig.options.scales.yAxes[1].scaleLabel.labelString = 'Vether Price (USD)'
        // chartConfig.options.scales.yAxes[1].ticks.max = chartConfig.options.scales.yAxes[0].ticks.max
        // console.log(chartConfig.options.scales.yAxes[1])
        newChartInstance.update()
    }

    return(
        <div style={ChartStyles}>
            <canvas ref={chartContainer} />
        </div>
    )
}
