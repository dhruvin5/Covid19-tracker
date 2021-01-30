const express = require('express');
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const ejsMate = require('ejs-mate');
const Coordinate=require('./models/coordinates')
const methodOverride = require('method-override');
const covid= require('./apis/covid')
const path = require('path');
const mongoose = require('mongoose');
const { response } = require('express');
mongoose.connect('mongodb://localhost:27017/covid', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});
const app = express();
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));

app.get("/",async(req,res)=>{
    var IndiaData=[]
    var resp=await covid.allCountriesData();
    for(let country in resp.data['Countries'])
    {
        if(resp.data['Countries'][country]['Country']=='India')
        {
            IndiaData.push(resp.data['Countries'][country])
        }
    }

    res.render('home.ejs',IndiaData)
})
app.get("/covid19.org",async(req,res)=>{
    var resp=await covid.stateWise();
    var districtCases=await Coordinate.find({});
    var i=0;
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
                districtCases[i].properties['active']=dist[district]['active'];
                districtCases[i].properties['confirmed']=dist[district]['confirmed'];
                districtCases[i].properties['recovered']=dist[district]['recovered'];
                districtCases[i].properties.delta['deceased']=dist[district]['deceased'];
                districtCases[i].properties.delta['confirmed']=dist[district]['confirmed'];
                districtCases[i].properties.delta['recovered']=dist[district]['recovered'];
                districtCases[i].properties.delta['deceased']=dist[district]['deceased'];
                
                i=i+1;
            }
        }
    }
    res.render('mainpage',{districtCases})
})


app.listen(3000, () => {
    console.log('Serving on port 3000')
})
