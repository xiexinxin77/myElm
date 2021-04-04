export default {
    RECORD_ADDRESS(state, {latitude, longitude}) {
        state.latitude = latitude
        state.longitude = longitude
    },
    SAVE_GEOHASH(state, geohash) {
        state.geohash = geohash
    }
}