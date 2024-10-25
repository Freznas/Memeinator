import { useState } from "react"


export function ApiHandler() {

    const [data, setData] = useState([])

    function fetchMemes() {
        const baseUrl = "https://api.imgflip.com/get_memes"
        fetch(baseUrl)
            .then(response => response.json())
            .then(json => {
                if (json.success && Array.isArray(json.data.memes)) {
                    let memeData = json.data.memes
                    setData(memeData)
                }
            })
            .catch(err => console.error('Error: ', err));
    }

    return {
        data,
        fetchMemes
      }
}