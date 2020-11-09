import * as React from 'react'

import { fetchCoin } from "../../http";
import { Coin } from '../Coin'

import './index.css'

interface HeaderProps {
    onSelected: (coin: string) => void;
}

interface Price {
    [key: string]: { oldPrice: number, currentPrice: number }
}
const ALL_PRICES: Price = {

    'BTC': { oldPrice: 0, currentPrice: 0 },
    'LTC': { oldPrice: 0, currentPrice: 0 },
    'EUR': { oldPrice: 0, currentPrice: 0 },
    'USD': { oldPrice: 0, currentPrice: 0 }
}

export const Header: React.FC<HeaderProps> = (props) => {
    const { onSelected } = props
    const [prices, setPrices] = React.useState<Price>(ALL_PRICES);

    React.useEffect(() => {
        const intervals = Object.keys(ALL_PRICES).map(coin => {
            return setInterval(() => {
                return fetchCoin(coin).then(data => {
                    setPrices(prevState => {

                        if (prevState[coin].currentPrice === data.BRL) {
                            return prevState;
                        }

                        return {
                            ...prevState,
                            [coin]: {
                                oldPrice: prevState[coin].currentPrice,
                                currentPrice: data.BRL
                            }
                        }
                    }
                    )
                })
            }, 5000)
        })
        return () => {
            intervals.forEach(interval => {
                clearInterval(interval)
            });
        }
    }, [])

    return (
        <div className="header">
            {
                Object.keys(prices).map(coin => (
                    <div className="item" onClick={() => onSelected(coin)}>
                        <Coin
                            coin={coin}
                            oldPrice={prices[coin].oldPrice}
                            currentPrice={prices[coin].currentPrice}
                        />
                    </div>
                ))
            }
        </div>
    )
}