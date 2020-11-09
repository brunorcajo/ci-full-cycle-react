import React from "react";
import './index.css'

interface CoinProps {
    coin: string;
    oldPrice: number;
    currentPrice: number;
}

export const Coin: React.FC<CoinProps> = (props) => {
    const { coin, oldPrice, currentPrice } = props;

    let status = 'up';
    if (oldPrice > currentPrice) {
        status = 'down'
    }

    return (
        <div className={`coin ${status}`}>
            <span>{coin}</span>
            <span>R$ {currentPrice.toLocaleString()}</span>
        </div>
    )
};
