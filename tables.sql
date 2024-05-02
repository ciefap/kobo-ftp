-- Table: public.stations

-- DROP TABLE IF EXISTS public.stations;

CREATE TABLE IF NOT EXISTS public.stations
(
    id integer NOT NULL DEFAULT nextval('stations_id_seq'::regclass),
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

ALTER TABLE IF EXISTS public.stations
    OWNER to postgres;
    
-- Table: public.vuelos

-- DROP TABLE IF EXISTS public.vuelos;

CREATE TABLE IF NOT EXISTS public.vuelos
(
    id integer NOT NULL,
    id_vuelo integer,
    data jsonb,
    area_vuelo geometry,
    coord_home geometry,
    lugar geometry,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    CONSTRAINT vuelos_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.vuelos
    OWNER to postgres;
