import express from 'express'

import { MongoService } from './services/mongo';

MongoService.connect()


const PORT = process.env.PORT || 8080;
const app: express.Application = express();


app.listen(PORT, () => console.log(`Listening on port ${PORT}`));


// // Historic handlers
// router.HandleFunc("/api/historic/upload", uploadHistoricData).Methods("POST")
// router.HandleFunc("/api/historic/water", getWaterHistoricData).Methods("GET")
// router.HandleFunc("/api/historic/{sensor}", getHistoricData).Methods("GET")

// // Live handlers
// router.HandleFunc("/api/live/upload", uploadLiveData).Methods("POST")
// router.HandleFunc("/api/live/{sensor}", getLiveData).Methods("GET")
// router.HandleFunc("/api/location/upload", uploadLocationData).Methods("POST")
// router.HandleFunc("/api/location/{type}", getLocationData).Methods("GET")
// router.HandleFunc("/api/water/upload", uploadWaterData).Methods("POST")
// router.HandleFunc("/api/water", getWaterWs).Methods("GET")

// // Notification handlers
// router.HandleFunc("/api/tweet", postTweet).Methods("POST")
// router.HandleFunc("/api/tweets", getTweets).Methods("GET")
// router.HandleFunc("/api/tweet/question", postQuestionTweet).Methods("POST")
// router.HandleFunc("/api/notifications", getNotificationsWs).Methods("GET")
// router.HandleFunc("/api/notification", pushNotification).Methods("POST")
// router.HandleFunc("/api/notification/all", getAllNotifications).Methods("GET")

// // Setting handlers
// router.HandleFunc("/api/setting", setPlantSetting).Methods("POST")
// router.HandleFunc("/api/setting/delete/{plantName}", deletePlantSetting).Methods("GET")
// router.HandleFunc("/api/setting/create", createPlantSetting).Methods("POST")
// router.HandleFunc("/api/setting", getPlantSettingWs).Methods("GET")
// router.HandleFunc("/api/setting/all", getAllPlantsSettings).Methods("GET")

// // Plant handlers
// router.HandleFunc("/api/health/upload/{plant}", updatePlantHealth).Methods("POST")
// router.HandleFunc("/api/health", getPlantHealth).Methods("GET")

// // Misc handlers
// router.HandleFunc("/api/docs", getDocumentation).Methods("GET")