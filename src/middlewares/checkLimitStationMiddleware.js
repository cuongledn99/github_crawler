import Errors from 'constants/errors'
import { resError } from 'utils/res'
import _ from 'lodash'
 

export default async function checkLimitStationMiddleware(req,res,next){
    try {
        
        let totalStation = _.get(req.user, 'organization.license.totalStation', null)
        
        // old customers didn't have this field yet, so allow them create unlimited station
        if (_.isNull(totalStation)) return next()
        
        // check amountOfCurrentStations
        let amountOfCurrentStations = await req.dao.stationAutoDao.getTotalCount()
        if (amountOfCurrentStations == totalStation){
            resError(res, Errors.REACHED_MAX_STATIONS)
        }
        
        next()
    } catch (error) {  
        console.log('----------------------------------------------')
        console.log(error)
        console.log('----------------------------------------------')
        resError(res, error.message)
    }
}