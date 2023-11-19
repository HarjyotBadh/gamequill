import React from 'react';

export default function HelloWorld({ game_id }) {
    const callUpdatePriceFunction = () => {
        const ob = { game_id: game_id };

        // const corsAnywhereUrl = "http://localhost:8080/";
        const functionUrl = 'http://localhost:5001/gamequill-3bab8/us-central1/updateGamePrice';

        fetch(functionUrl, {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify({ data: ob }) // Wrap your payload in a `data` object
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
