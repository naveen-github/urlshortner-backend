const { sequelize, Urls, Urlstats } = require('./../config/db')
const shortid = require('shortid')
const geoip = require('geoip-lite');
const { Op, QueryTypes } = require("sequelize");
module.exports = {

    /**
     * @method Create Short URL
     * @description Create short URL and add into database
     * @date 13-Sep-2020
     * @author Naveen Gupta
     * @param req Object
     * @param res Object
     * @returns json Object with status
     */
    createShortUrl: (req, res) => {
        let body = req.body;
        if(!('originalUrl' in body))
            return res.status(400).json({status:0, message:"Parameter missing or invalid"});

        let shortUrl = shortid.generate()
        let data =  {...body, shortUrl}
        try {
            Urls.create(data);
            data.shortUrl = `${process.env.BASEURL}${data.shortUrl}`
            return res.status(200).json({status:1, message:"Short Url Created",data});
        } catch (error) {
            return res.status(500).json({status:0, message:error.message});
        }
    },

    /**
     * @method Url redirect
     * @description URL redirect from short URL to Original URL
     * @date 13-Sep-2020
     * @author Naveen Gupta
     * @param req Object
     * @param res Object
     * @returns json Object with status
     */
    urlRedirect: async (req, res) => {
        var shortUrl = req.params.url;
        let ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress; //'103.102.90.74'
        var geo = geoip.lookup(ip);
 
        if(!shortUrl)
        return res.status(400).json({status:0, message:"Parameter missing or invalid"});

        let dt = new Date();
        let dateBeforeMonth = new Date(dt.setMonth(dt.getMonth() - 1))
        let urlExist = await Urls.findOne({where: {
            shortUrl,
            createdAt: {
              [Op.gt]: dateBeforeMonth
            }
          }});
        if(urlExist){
            let urlStatsData = {
                urlUUID: urlExist.uuid,
                userIp: ip
            }
            if(geo){
                urlStatsData = {...urlStatsData, country:geo.country, city: geo.city, timezone: geo.timezone}
            }
            Urlstats.create(urlStatsData).then().catch();
            res.setHeader('Location',urlExist.originalUrl);
            res.sendStatus(302)
        }else{
            return res.sendStatus(404);
        }
    },

    /**
     * @method Get Stats
     * @description Get tracking stats of Url clicked
     * @date 13-Sep-2020
     * @author Naveen Gupta
     * @param req Object
     * @param res Object
     * @returns json Object with status
     */
    getStats: async (req, res) => {
        const stats = await sequelize.query("SELECT urlstats.urlUUID, urls.originalUrl, urls.shortUrl, COUNT(urlstats.urlUUID) as noofClicks FROM `urls` INNER JOIN urlstats on urls.uuid = urlstats.urlUUID group by urlstats.urlUUID", { type: QueryTypes.SELECT });
        for (const [key, item] of stats.entries()) {
                var topCountries = await sequelize.query("SELECT urlstats.country, COUNT(urlstats.country) as noofcountry FROM `urls` INNER JOIN urlstats on urls.uuid = urlstats.urlUUID WHERE urlstats.urlUUID = '"+item.urlUUID+"' and urlstats.country!='' GROUP by urlstats.country ORDER BY noofcountry DESC LIMIT 4", { type: QueryTypes.SELECT })
                topCountries = topCountries.map(el => `${el.country}`).join(', ')
                stats[key]['topCountries'] = topCountries
                stats[key]['shortUrl'] = `${process.env.BASEURL}${item.shortUrl}`
        }
        if(stats.length<1)
        return res.status(204).json({status:0, message:"No record found"});

        return res.status(200).json({status:1, message:"Url stats found", data:stats});
    },

    

} // Closing Export