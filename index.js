const express =require('express');
const axios=require('axios');
const path= require('path');
const app= express();


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.get('/', (req, res) => {
    res.send('Hello everyone!');
});

app.get('/api/index', (req, res) => {
    res.render('api/index')
});

app.get('/api/filterPlant', (req, res) => {
    res.render('api/filterPlant');
});
app.get('/api/showname', (req, res) => {
    res.render('api/ShowPlantname');
});
app.get('/api/search', (req, res) => {
    res.render('api/search')
});

app.get('/api/plants', async (req, res) => {
    const flower_colors = req.query.flower_color;
    const bloom_months=req.query.bloom_months;
   
    const token = '0GRN8GPD1SJoJy9sEE58njMpcpL8Z3ld6jSOId-he7w';
    let colorFilter = '';
    let bloom_monthFilter = '';

    if (Array.isArray(flower_colors)) {
        colorFilter = flower_colors.join(',');
    } else if (typeof flower_colors === 'string') {
        colorFilter = flower_colors;
    }
    if (Array.isArray(bloom_months)) {
        bloom_monthFilter = bloom_months.join(',');
    } else if (typeof bloom_months === 'string') {
        bloom_monthFilter = bloom_months;
    }
console.log(colorFilter);
console.log(bloom_monthFilter)
if ( (bloom_monthFilter.length > 0) &&(colorFilter.length > 0)) {
    url = `https://trefle.io/api/v1/species?token=${token}&filter[bloom_months]=${bloom_monthFilter}&[flower_color]=${colorFilter}`;
}else if ( (bloom_monthFilter.length > 0) &&(colorFilter.length == 0)){
    url = `https://trefle.io/api/v1/species?token=${token}&filter[bloom_months]=${bloom_monthFilter}`

}else if ((bloom_monthFilter.length == 0) &&(colorFilter.length > 0)){
    const url = `https://trefle.io/api/v1/species?token=${token}&filter[flower_color]=${colorFilter}`;
}else{
    url = `https://trefle.io/api/v1/species?token=${token}`;
}
    console.log(url);

   
    try {
        const response = await axios.get(url);
        const data = response.data;
       // console.log(data)
        
        res.render('api/index', { plants: data.data });
    } catch (error) {
        console.error('Error fetching data from external API:', error);
        res.status(500).send('Error fetching data');
    }
});
app.get('/api/searchNametreflo', async (req, res) => {
    const token = '0GRN8GPD1SJoJy9sEE58njMpcpL8Z3ld6jSOId-he7w';
    const { genericName } = req.query;
  console.log(genericName);
  url = `https://trefle.io/api/v1/species/search?token=${token}&q=${genericName}`;
  try {
    const response = await axios.get(url);
    const data = response.data;
   // console.log(data)
    
    res.render('api/index', { plants: data.data });
} catch (error) {
    console.error('Error fetching data from external API:', error);
    res.status(500).send('Error fetching data');
}

}); 
app.get('/api/searchName1', async (req, res) => {
    const { genericName } = req.query;
  console.log(genericName);
  const url=`https://api.biodiversitydata.nl/v2/specimen/groupByScientificName/?gatheringEvent.country=Netherlands&collectionType=Botany&identifications.scientificName.genusOrMonomial=${genericName}`

   //const url = `https://api.gbif.org/v1/occurrence/search?continent=EUROPE&countryCode=NL&country=NL&genericName=${genericName}`;

   try {
       const response = await axios.get(url);
       const data = response.data;
      console.log(response.data.resultSet)
      //const data=response.resultSet
      // console.log(response)
       // Render index.ejs and pass the data
      
       
       res.render('api/ShowPlantname', { plants:data.results });
   } catch (error) {
       console.error('Error fetching data from external API:', error);
       res.status(500).send('Error fetching data');
   }
});


app.get('/api/searchName', async (req, res) => {
    const { genericName } = req.query;
    console.log(genericName);
    const url = `https://api.biodiversitydata.nl/v2/specimen/groupByScientificName/?gatheringEvent.country=Netherlands&collectionType=Botany&identifications.scientificName.genusOrMonomial=${genericName}`;

    try {
        const response = await axios.get(url);
        const data = response.data;

        // Extract the scientific names from the GBIF API response
        const scientificNames = data.resultSet.map(item => item.item.name);
        console.log(scientificNames);
        // Prepare to send these names to the Trefle API
        const token = '0GRN8GPD1SJoJy9sEE58njMpcpL8Z3ld6jSOId-he7w';
        const treflePromises = scientificNames.map(name => {
            const trefleUrl = `https://trefle.io/api/v1/species/search?token=${token}&q=${name}`;
            return axios.get(trefleUrl);
        });

        // Wait for all Trefle API requests to complete
        const trefleResponses = await Promise.all(treflePromises);
        const trefleData = trefleResponses.map(response => response.data.data).flat();

        // Render the combined results
        res.render('api/index', { plants: trefleData });
    } catch (error) {
        console.error('Error fetching data from external API:', error);
        res.status(500).send('Error fetching data');
    }
});

app.listen(3000,()=>{
    console.log('Server is running on port 3000');
});