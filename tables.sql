CREATE TABLE IF NOT EXISTS public.stations
(
    id SERIAL NOT NULL,
    name character varying COLLATE pg_catalog."default",
    geom geometry,
    code character varying COLLATE pg_catalog."default",
    elevation double precision,
    latitude double precision,
    longitude double precision,
    CONSTRAINT stations_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.stations
    OWNER to postgres;

INSERT INTO public.stations(name, code, elevation, latitude, longitude)
	VALUES 
        ('Puesto Blanco','',994.1,-41.717083,-71.142970),
        ('Antena','Antena',1078.5,-41.662180,-71.290808),
        ('Pampa Linda','PampaLinda',	934.5,-41.575231,-71.430145),
        ('Juan Test','',491.5,-41.603207,-71.521340),
        ('Manso Inferior','ElMansoInferior',437.8,-41.601263,-71.733769),
        ('Paso El León','PasoElLeon',462.8,-41.510581,-71.846346);

UPDATE stations set geom = st_point(longitude, latitude);

-- Table: public.stations_data

-- DROP TABLE IF EXISTS public.stations_data;

CREATE TABLE IF NOT EXISTS public.stations_data
(
    id SERIAL NOT NULL,
    station character varying COLLATE pg_catalog."default",
    frequency character varying COLLATE pg_catalog."default",
    "timestamp" timestamp without time zone,
    record integer,
    battv_min double precision,
    ptemp_c_avg double precision,
    slrfd_w_avg double precision,
    rain_mm_tot double precision,
    strikes_tot double precision,
    dist_km_avg double precision,
    ws_ms_avg double precision,
    winddir double precision,
    maxws_ms_max double precision,
    airt_c_avg double precision,
    vp_mbar_avg double precision,
    bp_mbar_avg double precision,
    rh double precision,
    rht_c double precision,
    tiltns_deg_avg double precision,
    tiltwe_deg_avg double precision,
    slrtf_mj_tot double precision,
    cvmeta character varying COLLATE pg_catalog."default",
    invalid_wind_avg double precision,
    par_den_avg double precision,
    par_tot_tot double precision,
    calibratedcountsvwc_10cm_avg double precision,
    temperature_10cm_avg double precision,
    electricalconductivity_10cm_avg double precision,
    vwcmineral_10cm_avg double precision,
    vwcsoilless_10cm_avg double precision,
    vwcdielectric_10cm_avg double precision,
    calibratedcountsvwc_40cm_avg double precision,
    temperature_40cm_avg double precision,
    electricalconductivity_40cm_avg double precision,
    vwcmineral_40cm_avg double precision,
    vwcsoilless_40cm_avg double precision,
    vwcdielectric_40cm_avg double precision,
    calibratedcountsvwc_80cm_avg double precision,
    temperature_80cm_avg double precision,
    electricalconductivity_80cm_avg double precision,
    vwcmineral_80cm_avg double precision,
    vwcsoilless_80cm_avg double precision,
    vwcdielectric_80cm_avg double precision,
    fuelm_avg double precision,
    pa_us_avg double precision,
    t_fuelmoist_avg double precision
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.stations_data
    OWNER to postgres;
    
-- Table: public.vuelos

-- DROP TABLE IF EXISTS public.vuelos;

CREATE TABLE IF NOT EXISTS public.vuelos
(
    id integer NOT NULL,
    id_vuelo integer,
    data jsonb,
    area_vuelo geometry,
    lugar geometry,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    CONSTRAINT vuelos_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.vuelos
    OWNER to postgres;

