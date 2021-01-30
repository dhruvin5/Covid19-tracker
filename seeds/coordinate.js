const mongoose = require('mongoose');
const covid= require('../apis/covid')
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = 'pk.eyJ1IjoiZGhydXZpbjUiLCJhIjoiY2trOW53NHAzMHc3ejJ1bG5jcjk0Z251aCJ9.g2fZ69fop20Lajo-GSNhIw';
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
mongoose.connect('mongodb://localhost:27017/covid', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});
const Coordinate=require('../models/coordinates')
const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});
const options = { ordered: true };
const seedDB = async () => {
    await Coordinate.deleteMany({});
    var IndiaData={
        features:[]
        
    }
    var resp=await covid.stateWise();
    //console.log(resp.data)
    
    for(let country in resp.data)
    {
        dist=resp.data[country]['districtData'];
        for (let district in dist)
        {
            if(district=='Unassigned'||district=='Other State'||district=='Unknown'||district=='Other Region')
            {
                
            }
            else
            {
                try{
                const districtData=await geocoder.forwardGeocode({
                    query: `${district},${country}`, 
                    limit: 1
                 }).send()
                 var a=districtData.body.features[0].geometry.coordinates
                 const abc=await new Coordinate({
                     
                    type:"Feature",
                     geometry:
                    {
                        type:"Point",
                        coordinates:[parseFloat(a[0]),parseFloat(a[1])]
                    },
                    properties:{
                        district:district,
                        state:country,
                        active:0,
                        deceased:0,
                        confirmed:0,
                        recovered:0,
                        delta:{
                        deceased:0,
                        confirmed:0,
                        recovered:0,
                        }
                    },
                
                })
            await abc.save()    
            }catch(e)
                {
                    console.log(e)
                }
                 
            }
        }
    }    

}
seedDB().then(() => {
    mongoose.connection.close();
})