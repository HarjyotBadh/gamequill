import React from 'react';

export default function GamePriceUpdate({ game_id, price_update }) {
    const callUpdatePriceFunction = () => {
        const ob = { game_id: game_id };

        const functionUrl = 'https://us-central1-gamequill-3bab8.cloudfunctions.net/updateGamePrice';

        fetch(functionUrl, {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify({ data: ob })
      })
        .then(response => {
            console.log('Request successful', response);
        })
        .catch(error => {
            console.error('Request failed', error);
        });
    };

    return (
        <div>
            <div>Test</div>
            <button onClick={callUpdatePriceFunction}>Update Game Price</button>
        </div>
    );
}
