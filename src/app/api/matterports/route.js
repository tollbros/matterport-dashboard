export const GET = async (req) => {
  const URL = `https://${process.env.TOLL_RDS_GATEWAY_API_DOMAIN}/v1/search/matterports/getmatterports`;

  try {
    const gotData = await fetch(URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.TOLL_RDS_GATEWAY_API_KEY,
      },
    }).catch((gotDataError) => {
      console.log('SEVERE ERROR: Fetching Catalog PDFs!! NOOOOOOOO...');
      console.log(`SEVERE ${URL}`);
      console.log(gotDataError);
    });

    const data = await gotData.json();
    return Response.json(data);

  } catch (error) {
    console.log(`SEVERE ERROR: getCatalogPDFs: ${URL}`);
    console.error(error);
    res.json({});
  }
};
  
  