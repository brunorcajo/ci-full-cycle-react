import * as React from 'react'
import { createChart, CrosshairMode, ISeriesApi } from 'lightweight-charts';

import './index.css'
import { Legend } from '../Legend';
import { cryptoHttp } from '../../http';

interface ChartProps {
    coin: string
}

export const Chart: React.FC<ChartProps> = (props) => {
    const { coin } = props;

    const [prices, setPrices] = React.useState<any[]>([]);
    const [chartLoaded, setChartLoaded] = React.useState(false);

    const containerRef = React.useRef(null);
    const candleSeriesRef = React.useRef() as React.MutableRefObject<ISeriesApi<'Candlestick'>>

    React.useEffect(() => {
        const interval = setInterval(() => {
            cryptoHttp.get(`histominute?fsym=${coin}&tsym=BRL&limit=1`).then(({ data: { Data } }) => {
                setPrices((prevState) => {
                    const price = Data[1];
                    const newPrice = {
                        time: price.time,
                        low: price.low,
                        high: price.high,
                        open: price.open,
                        close: price.close,
                        volume: price.volumefrom
                    }
                    candleSeriesRef.current.update(newPrice)
                    return [...prevState, newPrice]
                })
            })
        }, 60000)

        return () => {
            clearInterval(interval)
        }
    }, [coin])

    React.useEffect(() => {

        if (!chartLoaded || !coin) return

        cryptoHttp.get(`histoday?fsym=${coin}&tsym=BRL&limit=500`).then(({ data: { Data } }) => {
            const prices = Data.map(row => ({
                time: row.time,
                low: row.low,
                high: row.high,
                open: row.open,
                close: row.close,
                volume: row.volumefrom
            }))

            setPrices(prices)
        })
    }, [chartLoaded, coin])

    React.useEffect(() => {
        if (!candleSeriesRef.current) return

        candleSeriesRef.current.setData(prices)
    }, [prices])

    React.useEffect(() => {
        setPrices([])
    }, [coin])

    React.useEffect(() => {
        const chart = createChart(containerRef.current, {
            width: containerRef?.current?.clientWidth,
            height: containerRef?.current?.clientHeight,
            layout: {
                backgroundColor: '#253248',
                textColor: 'rgba(255,255,255,0.9)'
            },
            grid: {
                vertLines: {
                    color: '#334158'
                },
                horzLines: {
                    color: '#334158'
                }
            },
            crosshair: {
                mode: CrosshairMode.Normal
            },
            //@ts-ignore
            priceScale: {
                borderColor: '#485c7b'
            },
            timeScale: {
                borderColor: '#485c7b'
            }
        });

        candleSeriesRef.current = chart.addCandlestickSeries({
            upColor: '#4bffb5',
            downColor: '#ff4976',
            borderDownColor: '#ff4976',
            borderUpColor: '#4bffb5',
            wickDownColor: '#838ca1',
            wickUpColor: '#838ca1',
        })

        setChartLoaded(true);
    }, [])

    return (
        <div className="chart" ref={containerRef}>
            <Legend legend={coin} />
        </div>
    )
}