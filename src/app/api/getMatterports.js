const getMatterports = async (req, res) => {
    const URL = `https://${process.env.TOLL_RDS_GATEWAY_API_DOMAIN}/v1/search/matterports/getmatterports`;
  
    try {
      const gotData = await fetch(URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.TOLL_RDS_GATEWAY_API_KEY,
        },
      }).catch((gotDataError) => {
        console.log('SEVERE ERROR: Fetching Catalog PDFs');
        console.log(`SEVERE ${URL}`);
        console.log(gotDataError);
      });
  
      /* try {
        const fetchedData = await gotData.json();
        res.json(fetchedData);
      } catch (fetchedDataError) {
        console.log('JSON return error - getCatalogPDFs.js');
        console.log(URL);
        console.log(fetchedDataError);
        res.json({});
      } */
    } catch (error) {
      console.log(`SEVERE ERROR: getCatalogPDFs: ${URL}`);
      console.error(error);
      res.json({});
    }
  };
  
  export default getCatalogPDFs;
  