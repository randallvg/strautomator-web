let countryCurrency = {}

export const state = () => ({
    lastUserFetch: new Date().valueOf(),
    errorTitle: null,
    errorMessage: null,
    errorMethod: null,
    user: null,
    athleteRecords: null,
    recipeProperties: null,
    recipeActions: null,
    recipeMaxLength: null,
    weatherProviders: null,
    linksOnPercent: null,
    ftpWeeks: null,
    gearwear: [],
    sportTypes: [],
    workoutTypes: [],
    recordFields: [],
    mapStyles: [],
    freePlanDetails: {},
    proPlanDetails: {},
    fitnessLevel: {},
    country: null,
    expectedCurrency: null,
    archiveDownloadDays: null,
    aiHumours: null,
    paddle: null
})

export const getters = {
    user(state) {
        return state.user
    },
    athleteRecords(state) {
        return state.athleteRecords
    },
    lastUserFetch(state) {
        return state.lastUserFetch
    }
}

export const mutations = {
    setError(state, data) {
        if (data) {
            state.errorTitle = data.title
            state.errorMessage = data.message
            state.errorMethod = data.method
        } else {
            state.errorTitle = null
            state.errorMessage = null
            state.errorMethod = null
        }
    },
    setRecipeOptions(state, data) {
        state.recipeProperties = data.recipeProperties
        state.recipeActions = data.recipeActions
        state.recipeMaxLength = data.recipeMaxLength
    },
    setWeatherProviders(state, data) {
        state.weatherProviders = data
    },
    setLinksOnPercent(state, data) {
        state.linksOnPercent = data
    },
    setSportTypes(state, data) {
        state.sportTypes = data
    },
    setWorkoutTypes(state, data) {
        state.workoutTypes = data
    },
    setRecordFields(state, data) {
        state.recordFields = data
    },
    setMapStyles(state, data) {
        state.mapStyles = data
    },
    setPlanDetails(state, data) {
        state.freePlanDetails = data.free
        state.proPlanDetails = data.pro
    },
    setFitnessLevel(state, data) {
        state.fitnessLevel = data
    },
    setFtpWeeks(state, data) {
        state.ftpWeeks = data
    },
    setGearWear(state, data) {
        state.gearwear = data
    },
    setAthleteRecords(state, data) {
        if (data) {
            delete data.id
            delete data.dateRefreshed
        }
        state.athleteRecords = data
    },
    setUser(state, data) {
        if (data?.recipes) {
            const recipes = Object.values(data.recipes)
            for (let recipe of recipes) {
                if (!recipe.op) recipe.op = "AND"
                if (!recipe.samePropertyOp) recipe.samePropertyOp = recipe.op
            }
        }
        state.user = data
    },
    setUserData(state, data) {
        for (let key in data) {
            state.user[key] = data[key]
        }
    },
    setLastUserFetch(state, data) {
        state.lastUserFetch = data
    },
    setUserPreferences(state, data) {
        if (!state.user.preferences) state.user.preferences = {}
        state.user.preferences = Object.assign(state.user.preferences, data)
    },
    setUserCalendarTemplate(state, data) {
        if (!state.user.preferences.calendarTemplate) state.user.preferences.calendarTemplate = {}
        state.user.preferences.calendarTemplate = Object.assign(state.user.preferences.calendarTemplate, data)
    },
    setCountryCurrency(state, country) {
        state.country = country
        state.expectedCurrency = countryCurrency[country] || "EUR"
    },
    setArchiveDownloadDays(state, days) {
        state.archiveDownloadDays = days
    },
    setAiHumours(state, data) {
        state.aiHumours = data
    },
    setUserRecipe(state, recipe) {
        state.user.recipes[recipe.id] = recipe
    },
    deleteUserRecipe(state, recipe) {
        delete state.user.recipes[recipe.id]
    },
    deleteUserRecipe(state, recipe) {
        delete state.user.recipes[recipe.id]
    },
    setPaddle(state, data) {
        state.paddle = {
            environment: data.api.environment,
            token: data.api.clientToken,
            priceId: data.priceId
        }
    }
}

export const actions = {
    async nuxtServerInit({commit, dispatch, state}, {req}) {
        if (process.server) {
            const core = require("strautomator-core")
            const settings = require("setmeup").settings

            // Set recipe properties, actions and rules.
            const recipeOptions = {
                recipeProperties: core.recipes.propertyList,
                recipeActions: core.recipes.actionList,
                recipeMaxLength: settings.recipes.maxLength
            }
            commit("setRecipeOptions", recipeOptions)

            // Set weather providers.
            const weatherProviders = core.weather.providers.map((p) => {
                return {value: p.name, text: p.title}
            })
            weatherProviders.unshift({value: null, text: "Default weather provider"})
            commit("setWeatherProviders", weatherProviders)

            // Set links on percentage.
            const percent = Math.round(100 / settings.plans.free.linksOn)
            commit("setLinksOnPercent", percent)

            // Set sport types.
            const sportTypes = Object.keys(core.StravaSport).map((s) => core.StravaSport[s])
            commit("setSportTypes", sportTypes)

            // Set workout types.
            const rideWorkoutKeys = Object.keys(core.StravaRideType).filter((s) => isNaN(s))
            const rideWorkoutTypes = rideWorkoutKeys.map((s) => {
                return {text: "Ride: " + s.replace(/([A-Z])/g, " $1").trim(), value: core.StravaRideType[s]}
            })
            const runWorkoutKeys = Object.keys(core.StravaRunType).filter((s) => isNaN(s))
            const runWorkoutTypes = runWorkoutKeys.map((s) => {
                return {text: "Run: " + s.replace(/([A-Z])/g, " $1").trim(), value: core.StravaRunType[s]}
            })
            const workoutTypes = rideWorkoutTypes.concat(runWorkoutTypes)
            commit("setWorkoutTypes", workoutTypes)

            // Tracked personal records fields.
            const recordFields = core.StravaTrackedRecords.slice()
            commit("setRecordFields", recordFields)

            // Set map styles.
            const mapStyles = Object.keys(core.StravaMapStyle).map((s) => {
                const baseTitle = s.replace(/([A-Z])/g, " $1").trim()
                const mapTitle = baseTitle.replace("Satellite3 D", "Satellite 3D").replace("Winter3 D", "Winter 3D")
                return {text: mapTitle, value: core.StravaMapStyle[s]}
            })
            commit("setMapStyles", mapStyles)

            commit("setPlanDetails", settings.plans)

            // Set fitness level enum.
            commit("setFitnessLevel", core.StravaFitnessLevel)

            // Set the FTP weeks default.
            commit("setFtpWeeks", settings.strava.ftp.weeks)

            // Set GDPR archive days interval.
            commit("setArchiveDownloadDays", settings.gdpr.requestDays)

            // Set AI generative humours.
            commit("setAiHumours", settings.ai.humours)

            // Set country and currency.
            let country = req.headers["cf-ipcountry"] || "US"
            commit("setCountryCurrency", country)
        }

        let user = state.user
        let oauth = state.oauth

        if (!user && oauth && oauth.accessToken) {
            await dispatch("assignUser", {req})
        } else {
        }
    },
    async assignUser({commit, state}, {req, res}) {
        const userId = state?.oauth?.userId || null
        let loggedUser

        try {
            if (!userId) {
                return
            }

            if (state?.oauth?.accessToken) {
                this.$axios.setToken(state.oauth.accessToken)
            }

            const urlUser = `/api/users/${userId}`
            const urlRecords = `/api/strava/${userId}/athlete-records`
            const urlGearWear = `/api/gearwear/${userId}`

            await Promise.all([this.$axios.$get(urlUser), this.$axios.$get(urlRecords), this.$axios.$get(urlGearWear)])
                .then((res) => {
                    loggedUser = res[0]
                    let country = loggedUser?.countryCode || req.headers["cf-ipcountry"] || "US"

                    // Set user and country currency.
                    commit("setUser", loggedUser)
                    commit("setCountryCurrency", country)

                    // Set athlete records.
                    try {
                        const aRecords = res[1] || {}
                        commit("setAthleteRecords", Object.keys(aRecords).length > 0 ? aRecords : null)
                    } catch (recordsEx) {
                        logger.error("nuxtServerInit.assignUser", `User ${userId}`, "Failed to assign records", recordsEx)
                    }

                    // Set GearWear configs.
                    try {
                        const gearwearConfigs = res[2] || []
                        commit("setGearWear", gearwearConfigs)
                    } catch (gearEx) {
                        logger.error("nuxtServerInit.assignUser", `User ${userId}`, "Failed to set GearWear configs", gearEx)
                    }
                })
                .catch((err) => {
                    throw err
                })
        } catch (ex) {
            if (process.server) {
                const logger = require("anyhow")
                logger.error("nuxtServerInit.assignUser", `User ${userId || "unknown"}`, ex)

                if (!loggedUser) {
                    commit("setUser", null)
                }
            } else {
                console.error(ex)
                const status = ex.response ? ex.response.status : 401
                document.location.href = `/error?status=${encodeURIComponent(status)}&message=${encodeURIComponent(ex.ToString())}`
            }
        }
    }
}
