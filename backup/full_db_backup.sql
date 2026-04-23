--
-- PostgreSQL database dump
--

\restrict M33kpbMKQapFhblndo2fNDcgtP65Qk8MHMS25Gc11MsvSP2I3PQx810eNcXPKy0

-- Dumped from database version 17.6
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: auth; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA auth;


ALTER SCHEMA auth OWNER TO supabase_admin;

--
-- Name: pg_cron; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION pg_cron; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_cron IS 'Job scheduler for PostgreSQL';


--
-- Name: extensions; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA extensions;


ALTER SCHEMA extensions OWNER TO postgres;

--
-- Name: graphql; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA graphql;


ALTER SCHEMA graphql OWNER TO supabase_admin;

--
-- Name: graphql_public; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA graphql_public;


ALTER SCHEMA graphql_public OWNER TO supabase_admin;

--
-- Name: pgbouncer; Type: SCHEMA; Schema: -; Owner: pgbouncer
--

CREATE SCHEMA pgbouncer;


ALTER SCHEMA pgbouncer OWNER TO pgbouncer;

--
-- Name: realtime; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA realtime;


ALTER SCHEMA realtime OWNER TO supabase_admin;

--
-- Name: storage; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA storage;


ALTER SCHEMA storage OWNER TO supabase_admin;

--
-- Name: supabase_migrations; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA supabase_migrations;


ALTER SCHEMA supabase_migrations OWNER TO postgres;

--
-- Name: vault; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA vault;


ALTER SCHEMA vault OWNER TO supabase_admin;

--
-- Name: pg_graphql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_graphql WITH SCHEMA graphql;


--
-- Name: EXTENSION pg_graphql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_graphql IS 'pg_graphql: GraphQL support';


--
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_stat_statements WITH SCHEMA extensions;


--
-- Name: EXTENSION pg_stat_statements; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_stat_statements IS 'track planning and execution statistics of all SQL statements executed';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: supabase_vault; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS supabase_vault WITH SCHEMA vault;


--
-- Name: EXTENSION supabase_vault; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION supabase_vault IS 'Supabase Vault Extension';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: aal_level; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.aal_level AS ENUM (
    'aal1',
    'aal2',
    'aal3'
);


ALTER TYPE auth.aal_level OWNER TO supabase_auth_admin;

--
-- Name: code_challenge_method; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.code_challenge_method AS ENUM (
    's256',
    'plain'
);


ALTER TYPE auth.code_challenge_method OWNER TO supabase_auth_admin;

--
-- Name: factor_status; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.factor_status AS ENUM (
    'unverified',
    'verified'
);


ALTER TYPE auth.factor_status OWNER TO supabase_auth_admin;

--
-- Name: factor_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.factor_type AS ENUM (
    'totp',
    'webauthn',
    'phone'
);


ALTER TYPE auth.factor_type OWNER TO supabase_auth_admin;

--
-- Name: oauth_authorization_status; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_authorization_status AS ENUM (
    'pending',
    'approved',
    'denied',
    'expired'
);


ALTER TYPE auth.oauth_authorization_status OWNER TO supabase_auth_admin;

--
-- Name: oauth_client_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_client_type AS ENUM (
    'public',
    'confidential'
);


ALTER TYPE auth.oauth_client_type OWNER TO supabase_auth_admin;

--
-- Name: oauth_registration_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_registration_type AS ENUM (
    'dynamic',
    'manual'
);


ALTER TYPE auth.oauth_registration_type OWNER TO supabase_auth_admin;

--
-- Name: oauth_response_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_response_type AS ENUM (
    'code'
);


ALTER TYPE auth.oauth_response_type OWNER TO supabase_auth_admin;

--
-- Name: one_time_token_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.one_time_token_type AS ENUM (
    'confirmation_token',
    'reauthentication_token',
    'recovery_token',
    'email_change_token_new',
    'email_change_token_current',
    'phone_change_token'
);


ALTER TYPE auth.one_time_token_type OWNER TO supabase_auth_admin;

--
-- Name: action; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.action AS ENUM (
    'INSERT',
    'UPDATE',
    'DELETE',
    'TRUNCATE',
    'ERROR'
);


ALTER TYPE realtime.action OWNER TO supabase_admin;

--
-- Name: equality_op; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.equality_op AS ENUM (
    'eq',
    'neq',
    'lt',
    'lte',
    'gt',
    'gte',
    'in'
);


ALTER TYPE realtime.equality_op OWNER TO supabase_admin;

--
-- Name: user_defined_filter; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.user_defined_filter AS (
	column_name text,
	op realtime.equality_op,
	value text
);


ALTER TYPE realtime.user_defined_filter OWNER TO supabase_admin;

--
-- Name: wal_column; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.wal_column AS (
	name text,
	type_name text,
	type_oid oid,
	value jsonb,
	is_pkey boolean,
	is_selectable boolean
);


ALTER TYPE realtime.wal_column OWNER TO supabase_admin;

--
-- Name: wal_rls; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.wal_rls AS (
	wal jsonb,
	is_rls_enabled boolean,
	subscription_ids uuid[],
	errors text[]
);


ALTER TYPE realtime.wal_rls OWNER TO supabase_admin;

--
-- Name: buckettype; Type: TYPE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TYPE storage.buckettype AS ENUM (
    'STANDARD',
    'ANALYTICS',
    'VECTOR'
);


ALTER TYPE storage.buckettype OWNER TO supabase_storage_admin;

--
-- Name: email(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.email() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.email', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email')
  )::text
$$;


ALTER FUNCTION auth.email() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION email(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.email() IS 'Deprecated. Use auth.jwt() -> ''email'' instead.';


--
-- Name: jwt(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.jwt() RETURNS jsonb
    LANGUAGE sql STABLE
    AS $$
  select 
    coalesce(
        nullif(current_setting('request.jwt.claim', true), ''),
        nullif(current_setting('request.jwt.claims', true), '')
    )::jsonb
$$;


ALTER FUNCTION auth.jwt() OWNER TO supabase_auth_admin;

--
-- Name: role(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.role() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role')
  )::text
$$;


ALTER FUNCTION auth.role() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION role(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.role() IS 'Deprecated. Use auth.jwt() -> ''role'' instead.';


--
-- Name: uid(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.uid() RETURNS uuid
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid
$$;


ALTER FUNCTION auth.uid() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION uid(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.uid() IS 'Deprecated. Use auth.jwt() -> ''sub'' instead.';


--
-- Name: grant_pg_cron_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_cron_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_cron'
  )
  THEN
    grant usage on schema cron to postgres with grant option;

    alter default privileges in schema cron grant all on tables to postgres with grant option;
    alter default privileges in schema cron grant all on functions to postgres with grant option;
    alter default privileges in schema cron grant all on sequences to postgres with grant option;

    alter default privileges for user supabase_admin in schema cron grant all
        on sequences to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on tables to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on functions to postgres with grant option;

    grant all privileges on all tables in schema cron to postgres with grant option;
    revoke all on table cron.job from postgres;
    grant select on table cron.job to postgres with grant option;
  END IF;
END;
$$;


ALTER FUNCTION extensions.grant_pg_cron_access() OWNER TO supabase_admin;

--
-- Name: FUNCTION grant_pg_cron_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_cron_access() IS 'Grants access to pg_cron';


--
-- Name: grant_pg_graphql_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_graphql_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
DECLARE
    func_is_graphql_resolve bool;
BEGIN
    func_is_graphql_resolve = (
        SELECT n.proname = 'resolve'
        FROM pg_event_trigger_ddl_commands() AS ev
        LEFT JOIN pg_catalog.pg_proc AS n
        ON ev.objid = n.oid
    );

    IF func_is_graphql_resolve
    THEN
        -- Update public wrapper to pass all arguments through to the pg_graphql resolve func
        DROP FUNCTION IF EXISTS graphql_public.graphql;
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language sql
        as $$
            select graphql.resolve(
                query := query,
                variables := coalesce(variables, '{}'),
                "operationName" := "operationName",
                extensions := extensions
            );
        $$;

        -- This hook executes when `graphql.resolve` is created. That is not necessarily the last
        -- function in the extension so we need to grant permissions on existing entities AND
        -- update default permissions to any others that are created after `graphql.resolve`
        grant usage on schema graphql to postgres, anon, authenticated, service_role;
        grant select on all tables in schema graphql to postgres, anon, authenticated, service_role;
        grant execute on all functions in schema graphql to postgres, anon, authenticated, service_role;
        grant all on all sequences in schema graphql to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on tables to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on functions to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on sequences to postgres, anon, authenticated, service_role;

        -- Allow postgres role to allow granting usage on graphql and graphql_public schemas to custom roles
        grant usage on schema graphql_public to postgres with grant option;
        grant usage on schema graphql to postgres with grant option;
    END IF;

END;
$_$;


ALTER FUNCTION extensions.grant_pg_graphql_access() OWNER TO supabase_admin;

--
-- Name: FUNCTION grant_pg_graphql_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_graphql_access() IS 'Grants access to pg_graphql';


--
-- Name: grant_pg_net_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_net_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_net'
  )
  THEN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_roles
      WHERE rolname = 'supabase_functions_admin'
    )
    THEN
      CREATE USER supabase_functions_admin NOINHERIT CREATEROLE LOGIN NOREPLICATION;
    END IF;

    GRANT USAGE ON SCHEMA net TO supabase_functions_admin, postgres, anon, authenticated, service_role;

    IF EXISTS (
      SELECT FROM pg_extension
      WHERE extname = 'pg_net'
      -- all versions in use on existing projects as of 2025-02-20
      -- version 0.12.0 onwards don't need these applied
      AND extversion IN ('0.2', '0.6', '0.7', '0.7.1', '0.8', '0.10.0', '0.11.0')
    ) THEN
      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;

      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;

      REVOKE ALL ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;
      REVOKE ALL ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;

      GRANT EXECUTE ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
      GRANT EXECUTE ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
    END IF;
  END IF;
END;
$$;


ALTER FUNCTION extensions.grant_pg_net_access() OWNER TO supabase_admin;

--
-- Name: FUNCTION grant_pg_net_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_net_access() IS 'Grants access to pg_net';


--
-- Name: pgrst_ddl_watch(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.pgrst_ddl_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN SELECT * FROM pg_event_trigger_ddl_commands()
  LOOP
    IF cmd.command_tag IN (
      'CREATE SCHEMA', 'ALTER SCHEMA'
    , 'CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO', 'ALTER TABLE'
    , 'CREATE FOREIGN TABLE', 'ALTER FOREIGN TABLE'
    , 'CREATE VIEW', 'ALTER VIEW'
    , 'CREATE MATERIALIZED VIEW', 'ALTER MATERIALIZED VIEW'
    , 'CREATE FUNCTION', 'ALTER FUNCTION'
    , 'CREATE TRIGGER'
    , 'CREATE TYPE', 'ALTER TYPE'
    , 'CREATE RULE'
    , 'COMMENT'
    )
    -- don't notify in case of CREATE TEMP table or other objects created on pg_temp
    AND cmd.schema_name is distinct from 'pg_temp'
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


ALTER FUNCTION extensions.pgrst_ddl_watch() OWNER TO supabase_admin;

--
-- Name: pgrst_drop_watch(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.pgrst_drop_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  obj record;
BEGIN
  FOR obj IN SELECT * FROM pg_event_trigger_dropped_objects()
  LOOP
    IF obj.object_type IN (
      'schema'
    , 'table'
    , 'foreign table'
    , 'view'
    , 'materialized view'
    , 'function'
    , 'trigger'
    , 'type'
    , 'rule'
    )
    AND obj.is_temporary IS false -- no pg_temp objects
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


ALTER FUNCTION extensions.pgrst_drop_watch() OWNER TO supabase_admin;

--
-- Name: set_graphql_placeholder(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.set_graphql_placeholder() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
    DECLARE
    graphql_is_dropped bool;
    BEGIN
    graphql_is_dropped = (
        SELECT ev.schema_name = 'graphql_public'
        FROM pg_event_trigger_dropped_objects() AS ev
        WHERE ev.schema_name = 'graphql_public'
    );

    IF graphql_is_dropped
    THEN
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language plpgsql
        as $$
            DECLARE
                server_version float;
            BEGIN
                server_version = (SELECT (SPLIT_PART((select version()), ' ', 2))::float);

                IF server_version >= 14 THEN
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql extension is not enabled.'
                            )
                        )
                    );
                ELSE
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql is only available on projects running Postgres 14 onwards.'
                            )
                        )
                    );
                END IF;
            END;
        $$;
    END IF;

    END;
$_$;


ALTER FUNCTION extensions.set_graphql_placeholder() OWNER TO supabase_admin;

--
-- Name: FUNCTION set_graphql_placeholder(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.set_graphql_placeholder() IS 'Reintroduces placeholder function for graphql_public.graphql';


--
-- Name: get_auth(text); Type: FUNCTION; Schema: pgbouncer; Owner: supabase_admin
--

CREATE FUNCTION pgbouncer.get_auth(p_usename text) RETURNS TABLE(username text, password text)
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $_$
  BEGIN
      RAISE DEBUG 'PgBouncer auth request: %', p_usename;

      RETURN QUERY
      SELECT
          rolname::text,
          CASE WHEN rolvaliduntil < now()
              THEN null
              ELSE rolpassword::text
          END
      FROM pg_authid
      WHERE rolname=$1 and rolcanlogin;
  END;
  $_$;


ALTER FUNCTION pgbouncer.get_auth(p_usename text) OWNER TO supabase_admin;

--
-- Name: check_quote_access(uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.check_quote_access(token_input uuid) RETURNS json
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  record_exists boolean;
  has_pass boolean;
BEGIN
  SELECT EXISTS(SELECT 1 FROM quotes WHERE public_token = token_input),
         (access_password IS NOT NULL AND access_password <> '')
  INTO record_exists, has_pass
  FROM quotes
  WHERE public_token = token_input;

  IF NOT record_exists THEN
    RETURN json_build_object('exists', false, 'requires_password', false);
  END IF;

  RETURN json_build_object('exists', true, 'requires_password', has_pass);
END;
$$;


ALTER FUNCTION public.check_quote_access(token_input uuid) OWNER TO postgres;

--
-- Name: expire_subscriptions_and_log(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.expire_subscriptions_and_log() RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT id, subscription_plan, subscription_ends_at
    FROM public.profiles
    WHERE subscription_status = 'active'
      AND subscription_ends_at IS NOT NULL
      AND subscription_ends_at < now()
  LOOP
    UPDATE public.profiles
    SET subscription_status = 'expired'
    WHERE id = r.id;

    INSERT INTO public.subscription_audit_logs (user_id, event, plan, details)
    VALUES (
      r.id,
      'expired',
      r.subscription_plan,
      jsonb_build_object(
        'subscription_ends_at', r.subscription_ends_at,
        'expired_at', now()
      )
    );
  END LOOP;
END;
$$;


ALTER FUNCTION public.expire_subscriptions_and_log() OWNER TO postgres;

--
-- Name: get_quote_secure(uuid, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_quote_secure(token_input uuid, password_input text DEFAULT NULL::text) RETURNS json
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  result json;
BEGIN
  SELECT json_build_object(
    'id', q.id,
    'number', q.number,
    'status', q.status,
    'date', q.date,
    'validUntil', q.valid_until,
    'warrantyDuration', q.warranty_duration,
    'paymentTerms', q.payment_terms,
    'services', q.services,
    'materials', q.materials,
    'totalValue', q.total_value,
    'companyInfo', q.company_info,
    'contractNumber', q.contract_number,
    'completionDate', q.completion_date,
    'warrantyUntil', q.warranty_until,
    'signatureData', q.signature_data,
    'viewedAt', q.viewed_at,
    'publicToken', q.public_token,
    'contractTerms', coalesce(ct.content, q.contract_terms),
    'client', CASE WHEN c.id IS NULL THEN NULL ELSE json_build_object(
      'id', c.id,
      'name', c.name
    ) END
  )
  INTO result
  FROM quotes q
  LEFT JOIN clients c ON q.client_id = c.id
  LEFT JOIN contracts ct ON ct.quote_id = q.id
  WHERE q.public_token = token_input
  AND (
    (q.access_password IS NULL OR q.access_password = '')
    OR
    (q.access_password = password_input)
  );
  RETURN result;
END;
$$;


ALTER FUNCTION public.get_quote_secure(token_input uuid, password_input text) OWNER TO postgres;

--
-- Name: handle_new_user(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, company_name, subscription_status, trial_ends_at)
  VALUES (
    new.id, 
    new.email, 
    'Gestor', 
    COALESCE(new.raw_user_meta_data->>'company_name', 'Minha Empresa'),
    'trial',
    (now() + interval '30 days')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;


ALTER FUNCTION public.handle_new_user() OWNER TO postgres;

--
-- Name: mark_quote_viewed(uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.mark_quote_viewed(quote_id_input uuid) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  UPDATE quotes SET viewed_at = now() WHERE id = quote_id_input;
END;
$$;


ALTER FUNCTION public.mark_quote_viewed(quote_id_input uuid) OWNER TO postgres;

--
-- Name: apply_rls(jsonb, integer); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer DEFAULT (1024 * 1024)) RETURNS SETOF realtime.wal_rls
    LANGUAGE plpgsql
    AS $$
declare
-- Regclass of the table e.g. public.notes
entity_ regclass = (quote_ident(wal ->> 'schema') || '.' || quote_ident(wal ->> 'table'))::regclass;

-- I, U, D, T: insert, update ...
action realtime.action = (
    case wal ->> 'action'
        when 'I' then 'INSERT'
        when 'U' then 'UPDATE'
        when 'D' then 'DELETE'
        else 'ERROR'
    end
);

-- Is row level security enabled for the table
is_rls_enabled bool = relrowsecurity from pg_class where oid = entity_;

subscriptions realtime.subscription[] = array_agg(subs)
    from
        realtime.subscription subs
    where
        subs.entity = entity_
        -- Filter by action early - only get subscriptions interested in this action
        -- action_filter column can be: '*' (all), 'INSERT', 'UPDATE', or 'DELETE'
        and (subs.action_filter = '*' or subs.action_filter = action::text);

-- Subscription vars
roles regrole[] = array_agg(distinct us.claims_role::text)
    from
        unnest(subscriptions) us;

working_role regrole;
claimed_role regrole;
claims jsonb;

subscription_id uuid;
subscription_has_access bool;
visible_to_subscription_ids uuid[] = '{}';

-- structured info for wal's columns
columns realtime.wal_column[];
-- previous identity values for update/delete
old_columns realtime.wal_column[];

error_record_exceeds_max_size boolean = octet_length(wal::text) > max_record_bytes;

-- Primary jsonb output for record
output jsonb;

begin
perform set_config('role', null, true);

columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'columns') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

old_columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'identity') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

for working_role in select * from unnest(roles) loop

    -- Update `is_selectable` for columns and old_columns
    columns =
        array_agg(
            (
                c.name,
                c.type_name,
                c.type_oid,
                c.value,
                c.is_pkey,
                pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
            )::realtime.wal_column
        )
        from
            unnest(columns) c;

    old_columns =
            array_agg(
                (
                    c.name,
                    c.type_name,
                    c.type_oid,
                    c.value,
                    c.is_pkey,
                    pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
                )::realtime.wal_column
            )
            from
                unnest(old_columns) c;

    if action <> 'DELETE' and count(1) = 0 from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            -- subscriptions is already filtered by entity
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 400: Bad Request, no primary key']
        )::realtime.wal_rls;

    -- The claims role does not have SELECT permission to the primary key of entity
    elsif action <> 'DELETE' and sum(c.is_selectable::int) <> count(1) from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 401: Unauthorized']
        )::realtime.wal_rls;

    else
        output = jsonb_build_object(
            'schema', wal ->> 'schema',
            'table', wal ->> 'table',
            'type', action,
            'commit_timestamp', to_char(
                ((wal ->> 'timestamp')::timestamptz at time zone 'utc'),
                'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'
            ),
            'columns', (
                select
                    jsonb_agg(
                        jsonb_build_object(
                            'name', pa.attname,
                            'type', pt.typname
                        )
                        order by pa.attnum asc
                    )
                from
                    pg_attribute pa
                    join pg_type pt
                        on pa.atttypid = pt.oid
                where
                    attrelid = entity_
                    and attnum > 0
                    and pg_catalog.has_column_privilege(working_role, entity_, pa.attname, 'SELECT')
            )
        )
        -- Add "record" key for insert and update
        || case
            when action in ('INSERT', 'UPDATE') then
                jsonb_build_object(
                    'record',
                    (
                        select
                            jsonb_object_agg(
                                -- if unchanged toast, get column name and value from old record
                                coalesce((c).name, (oc).name),
                                case
                                    when (c).name is null then (oc).value
                                    else (c).value
                                end
                            )
                        from
                            unnest(columns) c
                            full outer join unnest(old_columns) oc
                                on (c).name = (oc).name
                        where
                            coalesce((c).is_selectable, (oc).is_selectable)
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                    )
                )
            else '{}'::jsonb
        end
        -- Add "old_record" key for update and delete
        || case
            when action = 'UPDATE' then
                jsonb_build_object(
                        'old_record',
                        (
                            select jsonb_object_agg((c).name, (c).value)
                            from unnest(old_columns) c
                            where
                                (c).is_selectable
                                and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                        )
                    )
            when action = 'DELETE' then
                jsonb_build_object(
                    'old_record',
                    (
                        select jsonb_object_agg((c).name, (c).value)
                        from unnest(old_columns) c
                        where
                            (c).is_selectable
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                            and ( not is_rls_enabled or (c).is_pkey ) -- if RLS enabled, we can't secure deletes so filter to pkey
                    )
                )
            else '{}'::jsonb
        end;

        -- Create the prepared statement
        if is_rls_enabled and action <> 'DELETE' then
            if (select 1 from pg_prepared_statements where name = 'walrus_rls_stmt' limit 1) > 0 then
                deallocate walrus_rls_stmt;
            end if;
            execute realtime.build_prepared_statement_sql('walrus_rls_stmt', entity_, columns);
        end if;

        visible_to_subscription_ids = '{}';

        for subscription_id, claims in (
                select
                    subs.subscription_id,
                    subs.claims
                from
                    unnest(subscriptions) subs
                where
                    subs.entity = entity_
                    and subs.claims_role = working_role
                    and (
                        realtime.is_visible_through_filters(columns, subs.filters)
                        or (
                          action = 'DELETE'
                          and realtime.is_visible_through_filters(old_columns, subs.filters)
                        )
                    )
        ) loop

            if not is_rls_enabled or action = 'DELETE' then
                visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
            else
                -- Check if RLS allows the role to see the record
                perform
                    -- Trim leading and trailing quotes from working_role because set_config
                    -- doesn't recognize the role as valid if they are included
                    set_config('role', trim(both '"' from working_role::text), true),
                    set_config('request.jwt.claims', claims::text, true);

                execute 'execute walrus_rls_stmt' into subscription_has_access;

                if subscription_has_access then
                    visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
                end if;
            end if;
        end loop;

        perform set_config('role', null, true);

        return next (
            output,
            is_rls_enabled,
            visible_to_subscription_ids,
            case
                when error_record_exceeds_max_size then array['Error 413: Payload Too Large']
                else '{}'
            end
        )::realtime.wal_rls;

    end if;
end loop;

perform set_config('role', null, true);
end;
$$;


ALTER FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) OWNER TO supabase_admin;

--
-- Name: broadcast_changes(text, text, text, text, text, record, record, text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text DEFAULT 'ROW'::text) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    -- Declare a variable to hold the JSONB representation of the row
    row_data jsonb := '{}'::jsonb;
BEGIN
    IF level = 'STATEMENT' THEN
        RAISE EXCEPTION 'function can only be triggered for each row, not for each statement';
    END IF;
    -- Check the operation type and handle accordingly
    IF operation = 'INSERT' OR operation = 'UPDATE' OR operation = 'DELETE' THEN
        row_data := jsonb_build_object('old_record', OLD, 'record', NEW, 'operation', operation, 'table', table_name, 'schema', table_schema);
        PERFORM realtime.send (row_data, event_name, topic_name);
    ELSE
        RAISE EXCEPTION 'Unexpected operation type: %', operation;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Failed to process the row: %', SQLERRM;
END;

$$;


ALTER FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) OWNER TO supabase_admin;

--
-- Name: build_prepared_statement_sql(text, regclass, realtime.wal_column[]); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) RETURNS text
    LANGUAGE sql
    AS $$
      /*
      Builds a sql string that, if executed, creates a prepared statement to
      tests retrive a row from *entity* by its primary key columns.
      Example
          select realtime.build_prepared_statement_sql('public.notes', '{"id"}'::text[], '{"bigint"}'::text[])
      */
          select
      'prepare ' || prepared_statement_name || ' as
          select
              exists(
                  select
                      1
                  from
                      ' || entity || '
                  where
                      ' || string_agg(quote_ident(pkc.name) || '=' || quote_nullable(pkc.value #>> '{}') , ' and ') || '
              )'
          from
              unnest(columns) pkc
          where
              pkc.is_pkey
          group by
              entity
      $$;


ALTER FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) OWNER TO supabase_admin;

--
-- Name: cast(text, regtype); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime."cast"(val text, type_ regtype) RETURNS jsonb
    LANGUAGE plpgsql IMMUTABLE
    AS $$
declare
  res jsonb;
begin
  if type_::text = 'bytea' then
    return to_jsonb(val);
  end if;
  execute format('select to_jsonb(%L::'|| type_::text || ')', val) into res;
  return res;
end
$$;


ALTER FUNCTION realtime."cast"(val text, type_ regtype) OWNER TO supabase_admin;

--
-- Name: check_equality_op(realtime.equality_op, regtype, text, text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) RETURNS boolean
    LANGUAGE plpgsql IMMUTABLE
    AS $$
      /*
      Casts *val_1* and *val_2* as type *type_* and check the *op* condition for truthiness
      */
      declare
          op_symbol text = (
              case
                  when op = 'eq' then '='
                  when op = 'neq' then '!='
                  when op = 'lt' then '<'
                  when op = 'lte' then '<='
                  when op = 'gt' then '>'
                  when op = 'gte' then '>='
                  when op = 'in' then '= any'
                  else 'UNKNOWN OP'
              end
          );
          res boolean;
      begin
          execute format(
              'select %L::'|| type_::text || ' ' || op_symbol
              || ' ( %L::'
              || (
                  case
                      when op = 'in' then type_::text || '[]'
                      else type_::text end
              )
              || ')', val_1, val_2) into res;
          return res;
      end;
      $$;


ALTER FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) OWNER TO supabase_admin;

--
-- Name: is_visible_through_filters(realtime.wal_column[], realtime.user_defined_filter[]); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) RETURNS boolean
    LANGUAGE sql IMMUTABLE
    AS $_$
    /*
    Should the record be visible (true) or filtered out (false) after *filters* are applied
    */
        select
            -- Default to allowed when no filters present
            $2 is null -- no filters. this should not happen because subscriptions has a default
            or array_length($2, 1) is null -- array length of an empty array is null
            or bool_and(
                coalesce(
                    realtime.check_equality_op(
                        op:=f.op,
                        type_:=coalesce(
                            col.type_oid::regtype, -- null when wal2json version <= 2.4
                            col.type_name::regtype
                        ),
                        -- cast jsonb to text
                        val_1:=col.value #>> '{}',
                        val_2:=f.value
                    ),
                    false -- if null, filter does not match
                )
            )
        from
            unnest(filters) f
            join unnest(columns) col
                on f.column_name = col.name;
    $_$;


ALTER FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) OWNER TO supabase_admin;

--
-- Name: list_changes(name, name, integer, integer); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) RETURNS TABLE(wal jsonb, is_rls_enabled boolean, subscription_ids uuid[], errors text[], slot_changes_count bigint)
    LANGUAGE sql
    SET log_min_messages TO 'fatal'
    AS $$
  WITH pub AS (
    SELECT
      concat_ws(
        ',',
        CASE WHEN bool_or(pubinsert) THEN 'insert' ELSE NULL END,
        CASE WHEN bool_or(pubupdate) THEN 'update' ELSE NULL END,
        CASE WHEN bool_or(pubdelete) THEN 'delete' ELSE NULL END
      ) AS w2j_actions,
      coalesce(
        string_agg(
          realtime.quote_wal2json(format('%I.%I', schemaname, tablename)::regclass),
          ','
        ) filter (WHERE ppt.tablename IS NOT NULL AND ppt.tablename NOT LIKE '% %'),
        ''
      ) AS w2j_add_tables
    FROM pg_publication pp
    LEFT JOIN pg_publication_tables ppt ON pp.pubname = ppt.pubname
    WHERE pp.pubname = publication
    GROUP BY pp.pubname
    LIMIT 1
  ),
  -- MATERIALIZED ensures pg_logical_slot_get_changes is called exactly once
  w2j AS MATERIALIZED (
    SELECT x.*, pub.w2j_add_tables
    FROM pub,
         pg_logical_slot_get_changes(
           slot_name, null, max_changes,
           'include-pk', 'true',
           'include-transaction', 'false',
           'include-timestamp', 'true',
           'include-type-oids', 'true',
           'format-version', '2',
           'actions', pub.w2j_actions,
           'add-tables', pub.w2j_add_tables
         ) x
  ),
  -- Count raw slot entries before apply_rls/subscription filter
  slot_count AS (
    SELECT count(*)::bigint AS cnt
    FROM w2j
    WHERE w2j.w2j_add_tables <> ''
  ),
  -- Apply RLS and filter as before
  rls_filtered AS (
    SELECT xyz.wal, xyz.is_rls_enabled, xyz.subscription_ids, xyz.errors
    FROM w2j,
         realtime.apply_rls(
           wal := w2j.data::jsonb,
           max_record_bytes := max_record_bytes
         ) xyz(wal, is_rls_enabled, subscription_ids, errors)
    WHERE w2j.w2j_add_tables <> ''
      AND xyz.subscription_ids[1] IS NOT NULL
  )
  -- Real rows with slot count attached
  SELECT rf.wal, rf.is_rls_enabled, rf.subscription_ids, rf.errors, sc.cnt
  FROM rls_filtered rf, slot_count sc

  UNION ALL

  -- Sentinel row: always returned when no real rows exist so Elixir can
  -- always read slot_changes_count. Identified by wal IS NULL.
  SELECT null, null, null, null, sc.cnt
  FROM slot_count sc
  WHERE NOT EXISTS (SELECT 1 FROM rls_filtered)
$$;


ALTER FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) OWNER TO supabase_admin;

--
-- Name: quote_wal2json(regclass); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.quote_wal2json(entity regclass) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
      select
        (
          select string_agg('' || ch,'')
          from unnest(string_to_array(nsp.nspname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
        )
        || '.'
        || (
          select string_agg('' || ch,'')
          from unnest(string_to_array(pc.relname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
          )
      from
        pg_class pc
        join pg_namespace nsp
          on pc.relnamespace = nsp.oid
      where
        pc.oid = entity
    $$;


ALTER FUNCTION realtime.quote_wal2json(entity regclass) OWNER TO supabase_admin;

--
-- Name: send(jsonb, text, text, boolean); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean DEFAULT true) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
  generated_id uuid;
  final_payload jsonb;
BEGIN
  BEGIN
    -- Generate a new UUID for the id
    generated_id := gen_random_uuid();

    -- Check if payload has an 'id' key, if not, add the generated UUID
    IF payload ? 'id' THEN
      final_payload := payload;
    ELSE
      final_payload := jsonb_set(payload, '{id}', to_jsonb(generated_id));
    END IF;

    -- Set the topic configuration
    EXECUTE format('SET LOCAL realtime.topic TO %L', topic);

    -- Attempt to insert the message
    INSERT INTO realtime.messages (id, payload, event, topic, private, extension)
    VALUES (generated_id, final_payload, event, topic, private, 'broadcast');
  EXCEPTION
    WHEN OTHERS THEN
      -- Capture and notify the error
      RAISE WARNING 'ErrorSendingBroadcastMessage: %', SQLERRM;
  END;
END;
$$;


ALTER FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) OWNER TO supabase_admin;

--
-- Name: subscription_check_filters(); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.subscription_check_filters() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    /*
    Validates that the user defined filters for a subscription:
    - refer to valid columns that the claimed role may access
    - values are coercable to the correct column type
    */
    declare
        col_names text[] = coalesce(
                array_agg(c.column_name order by c.ordinal_position),
                '{}'::text[]
            )
            from
                information_schema.columns c
            where
                format('%I.%I', c.table_schema, c.table_name)::regclass = new.entity
                and pg_catalog.has_column_privilege(
                    (new.claims ->> 'role'),
                    format('%I.%I', c.table_schema, c.table_name)::regclass,
                    c.column_name,
                    'SELECT'
                );
        filter realtime.user_defined_filter;
        col_type regtype;

        in_val jsonb;
    begin
        for filter in select * from unnest(new.filters) loop
            -- Filtered column is valid
            if not filter.column_name = any(col_names) then
                raise exception 'invalid column for filter %', filter.column_name;
            end if;

            -- Type is sanitized and safe for string interpolation
            col_type = (
                select atttypid::regtype
                from pg_catalog.pg_attribute
                where attrelid = new.entity
                      and attname = filter.column_name
            );
            if col_type is null then
                raise exception 'failed to lookup type for column %', filter.column_name;
            end if;

            -- Set maximum number of entries for in filter
            if filter.op = 'in'::realtime.equality_op then
                in_val = realtime.cast(filter.value, (col_type::text || '[]')::regtype);
                if coalesce(jsonb_array_length(in_val), 0) > 100 then
                    raise exception 'too many values for `in` filter. Maximum 100';
                end if;
            else
                -- raises an exception if value is not coercable to type
                perform realtime.cast(filter.value, col_type);
            end if;

        end loop;

        -- Apply consistent order to filters so the unique constraint on
        -- (subscription_id, entity, filters) can't be tricked by a different filter order
        new.filters = coalesce(
            array_agg(f order by f.column_name, f.op, f.value),
            '{}'
        ) from unnest(new.filters) f;

        return new;
    end;
    $$;


ALTER FUNCTION realtime.subscription_check_filters() OWNER TO supabase_admin;

--
-- Name: to_regrole(text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.to_regrole(role_name text) RETURNS regrole
    LANGUAGE sql IMMUTABLE
    AS $$ select role_name::regrole $$;


ALTER FUNCTION realtime.to_regrole(role_name text) OWNER TO supabase_admin;

--
-- Name: topic(); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE FUNCTION realtime.topic() RETURNS text
    LANGUAGE sql STABLE
    AS $$
select nullif(current_setting('realtime.topic', true), '')::text;
$$;


ALTER FUNCTION realtime.topic() OWNER TO supabase_realtime_admin;

--
-- Name: allow_any_operation(text[]); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.allow_any_operation(expected_operations text[]) RETURNS boolean
    LANGUAGE sql STABLE
    AS $$
  WITH current_operation AS (
    SELECT storage.operation() AS raw_operation
  ),
  normalized AS (
    SELECT CASE
      WHEN raw_operation LIKE 'storage.%' THEN substr(raw_operation, 9)
      ELSE raw_operation
    END AS current_operation
    FROM current_operation
  )
  SELECT EXISTS (
    SELECT 1
    FROM normalized n
    CROSS JOIN LATERAL unnest(expected_operations) AS expected_operation
    WHERE expected_operation IS NOT NULL
      AND expected_operation <> ''
      AND n.current_operation = CASE
        WHEN expected_operation LIKE 'storage.%' THEN substr(expected_operation, 9)
        ELSE expected_operation
      END
  );
$$;


ALTER FUNCTION storage.allow_any_operation(expected_operations text[]) OWNER TO supabase_storage_admin;

--
-- Name: allow_only_operation(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.allow_only_operation(expected_operation text) RETURNS boolean
    LANGUAGE sql STABLE
    AS $$
  WITH current_operation AS (
    SELECT storage.operation() AS raw_operation
  ),
  normalized AS (
    SELECT
      CASE
        WHEN raw_operation LIKE 'storage.%' THEN substr(raw_operation, 9)
        ELSE raw_operation
      END AS current_operation,
      CASE
        WHEN expected_operation LIKE 'storage.%' THEN substr(expected_operation, 9)
        ELSE expected_operation
      END AS requested_operation
    FROM current_operation
  )
  SELECT CASE
    WHEN requested_operation IS NULL OR requested_operation = '' THEN FALSE
    ELSE COALESCE(current_operation = requested_operation, FALSE)
  END
  FROM normalized;
$$;


ALTER FUNCTION storage.allow_only_operation(expected_operation text) OWNER TO supabase_storage_admin;

--
-- Name: can_insert_object(text, text, uuid, jsonb); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO "storage"."objects" ("bucket_id", "name", "owner", "metadata") VALUES (bucketid, name, owner, metadata);
  -- hack to rollback the successful insert
  RAISE sqlstate 'PT200' using
  message = 'ROLLBACK',
  detail = 'rollback successful insert';
END
$$;


ALTER FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) OWNER TO supabase_storage_admin;

--
-- Name: delete_leaf_prefixes(text[], text[]); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.delete_leaf_prefixes(bucket_ids text[], names text[]) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_rows_deleted integer;
BEGIN
    LOOP
        WITH candidates AS (
            SELECT DISTINCT
                t.bucket_id,
                unnest(storage.get_prefixes(t.name)) AS name
            FROM unnest(bucket_ids, names) AS t(bucket_id, name)
        ),
        uniq AS (
             SELECT
                 bucket_id,
                 name,
                 storage.get_level(name) AS level
             FROM candidates
             WHERE name <> ''
             GROUP BY bucket_id, name
        ),
        leaf AS (
             SELECT
                 p.bucket_id,
                 p.name,
                 p.level
             FROM storage.prefixes AS p
                  JOIN uniq AS u
                       ON u.bucket_id = p.bucket_id
                           AND u.name = p.name
                           AND u.level = p.level
             WHERE NOT EXISTS (
                 SELECT 1
                 FROM storage.objects AS o
                 WHERE o.bucket_id = p.bucket_id
                   AND o.level = p.level + 1
                   AND o.name COLLATE "C" LIKE p.name || '/%'
             )
             AND NOT EXISTS (
                 SELECT 1
                 FROM storage.prefixes AS c
                 WHERE c.bucket_id = p.bucket_id
                   AND c.level = p.level + 1
                   AND c.name COLLATE "C" LIKE p.name || '/%'
             )
        )
        DELETE
        FROM storage.prefixes AS p
            USING leaf AS l
        WHERE p.bucket_id = l.bucket_id
          AND p.name = l.name
          AND p.level = l.level;

        GET DIAGNOSTICS v_rows_deleted = ROW_COUNT;
        EXIT WHEN v_rows_deleted = 0;
    END LOOP;
END;
$$;


ALTER FUNCTION storage.delete_leaf_prefixes(bucket_ids text[], names text[]) OWNER TO supabase_storage_admin;

--
-- Name: enforce_bucket_name_length(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.enforce_bucket_name_length() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
    if length(new.name) > 100 then
        raise exception 'bucket name "%" is too long (% characters). Max is 100.', new.name, length(new.name);
    end if;
    return new;
end;
$$;


ALTER FUNCTION storage.enforce_bucket_name_length() OWNER TO supabase_storage_admin;

--
-- Name: extension(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.extension(name text) RETURNS text
    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
    _parts text[];
    _filename text;
BEGIN
    SELECT string_to_array(name, '/') INTO _parts;
    SELECT _parts[array_length(_parts,1)] INTO _filename;
    RETURN reverse(split_part(reverse(_filename), '.', 1));
END
$$;


ALTER FUNCTION storage.extension(name text) OWNER TO supabase_storage_admin;

--
-- Name: filename(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.filename(name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[array_length(_parts,1)];
END
$$;


ALTER FUNCTION storage.filename(name text) OWNER TO supabase_storage_admin;

--
-- Name: foldername(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.foldername(name text) RETURNS text[]
    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
    _parts text[];
BEGIN
    -- Split on "/" to get path segments
    SELECT string_to_array(name, '/') INTO _parts;
    -- Return everything except the last segment
    RETURN _parts[1 : array_length(_parts,1) - 1];
END
$$;


ALTER FUNCTION storage.foldername(name text) OWNER TO supabase_storage_admin;

--
-- Name: get_common_prefix(text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_common_prefix(p_key text, p_prefix text, p_delimiter text) RETURNS text
    LANGUAGE sql IMMUTABLE
    AS $$
SELECT CASE
    WHEN position(p_delimiter IN substring(p_key FROM length(p_prefix) + 1)) > 0
    THEN left(p_key, length(p_prefix) + position(p_delimiter IN substring(p_key FROM length(p_prefix) + 1)))
    ELSE NULL
END;
$$;


ALTER FUNCTION storage.get_common_prefix(p_key text, p_prefix text, p_delimiter text) OWNER TO supabase_storage_admin;

--
-- Name: get_level(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_level(name text) RETURNS integer
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
SELECT array_length(string_to_array("name", '/'), 1);
$$;


ALTER FUNCTION storage.get_level(name text) OWNER TO supabase_storage_admin;

--
-- Name: get_prefix(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_prefix(name text) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $_$
SELECT
    CASE WHEN strpos("name", '/') > 0 THEN
             regexp_replace("name", '[\/]{1}[^\/]+\/?$', '')
         ELSE
             ''
        END;
$_$;


ALTER FUNCTION storage.get_prefix(name text) OWNER TO supabase_storage_admin;

--
-- Name: get_prefixes(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_prefixes(name text) RETURNS text[]
    LANGUAGE plpgsql IMMUTABLE STRICT
    AS $$
DECLARE
    parts text[];
    prefixes text[];
    prefix text;
BEGIN
    -- Split the name into parts by '/'
    parts := string_to_array("name", '/');
    prefixes := '{}';

    -- Construct the prefixes, stopping one level below the last part
    FOR i IN 1..array_length(parts, 1) - 1 LOOP
            prefix := array_to_string(parts[1:i], '/');
            prefixes := array_append(prefixes, prefix);
    END LOOP;

    RETURN prefixes;
END;
$$;


ALTER FUNCTION storage.get_prefixes(name text) OWNER TO supabase_storage_admin;

--
-- Name: get_size_by_bucket(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_size_by_bucket() RETURNS TABLE(size bigint, bucket_id text)
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    return query
        select sum((metadata->>'size')::bigint) as size, obj.bucket_id
        from "storage".objects as obj
        group by obj.bucket_id;
END
$$;


ALTER FUNCTION storage.get_size_by_bucket() OWNER TO supabase_storage_admin;

--
-- Name: list_multipart_uploads_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, next_key_token text DEFAULT ''::text, next_upload_token text DEFAULT ''::text) RETURNS TABLE(key text, id text, created_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(key COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                        substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1)))
                    ELSE
                        key
                END AS key, id, created_at
            FROM
                storage.s3_multipart_uploads
            WHERE
                bucket_id = $5 AND
                key ILIKE $1 || ''%'' AND
                CASE
                    WHEN $4 != '''' AND $6 = '''' THEN
                        CASE
                            WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                                substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                key COLLATE "C" > $4
                            END
                    ELSE
                        true
                END AND
                CASE
                    WHEN $6 != '''' THEN
                        id COLLATE "C" > $6
                    ELSE
                        true
                    END
            ORDER BY
                key COLLATE "C" ASC, created_at ASC) as e order by key COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_key_token, bucket_id, next_upload_token;
END;
$_$;


ALTER FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, next_key_token text, next_upload_token text) OWNER TO supabase_storage_admin;

--
-- Name: list_objects_with_delimiter(text, text, text, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.list_objects_with_delimiter(_bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, start_after text DEFAULT ''::text, next_token text DEFAULT ''::text, sort_order text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, metadata jsonb, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone)
    LANGUAGE plpgsql STABLE
    AS $_$
DECLARE
    v_peek_name TEXT;
    v_current RECORD;
    v_common_prefix TEXT;

    -- Configuration
    v_is_asc BOOLEAN;
    v_prefix TEXT;
    v_start TEXT;
    v_upper_bound TEXT;
    v_file_batch_size INT;

    -- Seek state
    v_next_seek TEXT;
    v_count INT := 0;

    -- Dynamic SQL for batch query only
    v_batch_query TEXT;

BEGIN
    -- ========================================================================
    -- INITIALIZATION
    -- ========================================================================
    v_is_asc := lower(coalesce(sort_order, 'asc')) = 'asc';
    v_prefix := coalesce(prefix_param, '');
    v_start := CASE WHEN coalesce(next_token, '') <> '' THEN next_token ELSE coalesce(start_after, '') END;
    v_file_batch_size := LEAST(GREATEST(max_keys * 2, 100), 1000);

    -- Calculate upper bound for prefix filtering (bytewise, using COLLATE "C")
    IF v_prefix = '' THEN
        v_upper_bound := NULL;
    ELSIF right(v_prefix, 1) = delimiter_param THEN
        v_upper_bound := left(v_prefix, -1) || chr(ascii(delimiter_param) + 1);
    ELSE
        v_upper_bound := left(v_prefix, -1) || chr(ascii(right(v_prefix, 1)) + 1);
    END IF;

    -- Build batch query (dynamic SQL - called infrequently, amortized over many rows)
    IF v_is_asc THEN
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE "C" >= $2 ' ||
                'AND o.name COLLATE "C" < $3 ORDER BY o.name COLLATE "C" ASC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE "C" >= $2 ' ||
                'ORDER BY o.name COLLATE "C" ASC LIMIT $4';
        END IF;
    ELSE
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE "C" < $2 ' ||
                'AND o.name COLLATE "C" >= $3 ORDER BY o.name COLLATE "C" DESC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE "C" < $2 ' ||
                'ORDER BY o.name COLLATE "C" DESC LIMIT $4';
        END IF;
    END IF;

    -- ========================================================================
    -- SEEK INITIALIZATION: Determine starting position
    -- ========================================================================
    IF v_start = '' THEN
        IF v_is_asc THEN
            v_next_seek := v_prefix;
        ELSE
            -- DESC without cursor: find the last item in range
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_next_seek FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" >= v_prefix AND o.name COLLATE "C" < v_upper_bound
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            ELSIF v_prefix <> '' THEN
                SELECT o.name INTO v_next_seek FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" >= v_prefix
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            ELSE
                SELECT o.name INTO v_next_seek FROM storage.objects o
                WHERE o.bucket_id = _bucket_id
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            END IF;

            IF v_next_seek IS NOT NULL THEN
                v_next_seek := v_next_seek || delimiter_param;
            ELSE
                RETURN;
            END IF;
        END IF;
    ELSE
        -- Cursor provided: determine if it refers to a folder or leaf
        IF EXISTS (
            SELECT 1 FROM storage.objects o
            WHERE o.bucket_id = _bucket_id
              AND o.name COLLATE "C" LIKE v_start || delimiter_param || '%'
            LIMIT 1
        ) THEN
            -- Cursor refers to a folder
            IF v_is_asc THEN
                v_next_seek := v_start || chr(ascii(delimiter_param) + 1);
            ELSE
                v_next_seek := v_start || delimiter_param;
            END IF;
        ELSE
            -- Cursor refers to a leaf object
            IF v_is_asc THEN
                v_next_seek := v_start || delimiter_param;
            ELSE
                v_next_seek := v_start;
            END IF;
        END IF;
    END IF;

    -- ========================================================================
    -- MAIN LOOP: Hybrid peek-then-batch algorithm
    -- Uses STATIC SQL for peek (hot path) and DYNAMIC SQL for batch
    -- ========================================================================
    LOOP
        EXIT WHEN v_count >= max_keys;

        -- STEP 1: PEEK using STATIC SQL (plan cached, very fast)
        IF v_is_asc THEN
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" >= v_next_seek AND o.name COLLATE "C" < v_upper_bound
                ORDER BY o.name COLLATE "C" ASC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" >= v_next_seek
                ORDER BY o.name COLLATE "C" ASC LIMIT 1;
            END IF;
        ELSE
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" < v_next_seek AND o.name COLLATE "C" >= v_prefix
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            ELSIF v_prefix <> '' THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" < v_next_seek AND o.name COLLATE "C" >= v_prefix
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" < v_next_seek
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            END IF;
        END IF;

        EXIT WHEN v_peek_name IS NULL;

        -- STEP 2: Check if this is a FOLDER or FILE
        v_common_prefix := storage.get_common_prefix(v_peek_name, v_prefix, delimiter_param);

        IF v_common_prefix IS NOT NULL THEN
            -- FOLDER: Emit and skip to next folder (no heap access needed)
            name := rtrim(v_common_prefix, delimiter_param);
            id := NULL;
            updated_at := NULL;
            created_at := NULL;
            last_accessed_at := NULL;
            metadata := NULL;
            RETURN NEXT;
            v_count := v_count + 1;

            -- Advance seek past the folder range
            IF v_is_asc THEN
                v_next_seek := left(v_common_prefix, -1) || chr(ascii(delimiter_param) + 1);
            ELSE
                v_next_seek := v_common_prefix;
            END IF;
        ELSE
            -- FILE: Batch fetch using DYNAMIC SQL (overhead amortized over many rows)
            -- For ASC: upper_bound is the exclusive upper limit (< condition)
            -- For DESC: prefix is the inclusive lower limit (>= condition)
            FOR v_current IN EXECUTE v_batch_query USING _bucket_id, v_next_seek,
                CASE WHEN v_is_asc THEN COALESCE(v_upper_bound, v_prefix) ELSE v_prefix END, v_file_batch_size
            LOOP
                v_common_prefix := storage.get_common_prefix(v_current.name, v_prefix, delimiter_param);

                IF v_common_prefix IS NOT NULL THEN
                    -- Hit a folder: exit batch, let peek handle it
                    v_next_seek := v_current.name;
                    EXIT;
                END IF;

                -- Emit file
                name := v_current.name;
                id := v_current.id;
                updated_at := v_current.updated_at;
                created_at := v_current.created_at;
                last_accessed_at := v_current.last_accessed_at;
                metadata := v_current.metadata;
                RETURN NEXT;
                v_count := v_count + 1;

                -- Advance seek past this file
                IF v_is_asc THEN
                    v_next_seek := v_current.name || delimiter_param;
                ELSE
                    v_next_seek := v_current.name;
                END IF;

                EXIT WHEN v_count >= max_keys;
            END LOOP;
        END IF;
    END LOOP;
END;
$_$;


ALTER FUNCTION storage.list_objects_with_delimiter(_bucket_id text, prefix_param text, delimiter_param text, max_keys integer, start_after text, next_token text, sort_order text) OWNER TO supabase_storage_admin;

--
-- Name: operation(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.operation() RETURNS text
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    RETURN current_setting('storage.operation', true);
END;
$$;


ALTER FUNCTION storage.operation() OWNER TO supabase_storage_admin;

--
-- Name: protect_delete(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.protect_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Check if storage.allow_delete_query is set to 'true'
    IF COALESCE(current_setting('storage.allow_delete_query', true), 'false') != 'true' THEN
        RAISE EXCEPTION 'Direct deletion from storage tables is not allowed. Use the Storage API instead.'
            USING HINT = 'This prevents accidental data loss from orphaned objects.',
                  ERRCODE = '42501';
    END IF;
    RETURN NULL;
END;
$$;


ALTER FUNCTION storage.protect_delete() OWNER TO supabase_storage_admin;

--
-- Name: search(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
DECLARE
    v_peek_name TEXT;
    v_current RECORD;
    v_common_prefix TEXT;
    v_delimiter CONSTANT TEXT := '/';

    -- Configuration
    v_limit INT;
    v_prefix TEXT;
    v_prefix_lower TEXT;
    v_is_asc BOOLEAN;
    v_order_by TEXT;
    v_sort_order TEXT;
    v_upper_bound TEXT;
    v_file_batch_size INT;

    -- Dynamic SQL for batch query only
    v_batch_query TEXT;

    -- Seek state
    v_next_seek TEXT;
    v_count INT := 0;
    v_skipped INT := 0;
BEGIN
    -- ========================================================================
    -- INITIALIZATION
    -- ========================================================================
    v_limit := LEAST(coalesce(limits, 100), 1500);
    v_prefix := coalesce(prefix, '') || coalesce(search, '');
    v_prefix_lower := lower(v_prefix);
    v_is_asc := lower(coalesce(sortorder, 'asc')) = 'asc';
    v_file_batch_size := LEAST(GREATEST(v_limit * 2, 100), 1000);

    -- Validate sort column
    CASE lower(coalesce(sortcolumn, 'name'))
        WHEN 'name' THEN v_order_by := 'name';
        WHEN 'updated_at' THEN v_order_by := 'updated_at';
        WHEN 'created_at' THEN v_order_by := 'created_at';
        WHEN 'last_accessed_at' THEN v_order_by := 'last_accessed_at';
        ELSE v_order_by := 'name';
    END CASE;

    v_sort_order := CASE WHEN v_is_asc THEN 'asc' ELSE 'desc' END;

    -- ========================================================================
    -- NON-NAME SORTING: Use path_tokens approach (unchanged)
    -- ========================================================================
    IF v_order_by != 'name' THEN
        RETURN QUERY EXECUTE format(
            $sql$
            WITH folders AS (
                SELECT path_tokens[$1] AS folder
                FROM storage.objects
                WHERE objects.name ILIKE $2 || '%%'
                  AND bucket_id = $3
                  AND array_length(objects.path_tokens, 1) <> $1
                GROUP BY folder
                ORDER BY folder %s
            )
            (SELECT folder AS "name",
                   NULL::uuid AS id,
                   NULL::timestamptz AS updated_at,
                   NULL::timestamptz AS created_at,
                   NULL::timestamptz AS last_accessed_at,
                   NULL::jsonb AS metadata FROM folders)
            UNION ALL
            (SELECT path_tokens[$1] AS "name",
                   id, updated_at, created_at, last_accessed_at, metadata
             FROM storage.objects
             WHERE objects.name ILIKE $2 || '%%'
               AND bucket_id = $3
               AND array_length(objects.path_tokens, 1) = $1
             ORDER BY %I %s)
            LIMIT $4 OFFSET $5
            $sql$, v_sort_order, v_order_by, v_sort_order
        ) USING levels, v_prefix, bucketname, v_limit, offsets;
        RETURN;
    END IF;

    -- ========================================================================
    -- NAME SORTING: Hybrid skip-scan with batch optimization
    -- ========================================================================

    -- Calculate upper bound for prefix filtering
    IF v_prefix_lower = '' THEN
        v_upper_bound := NULL;
    ELSIF right(v_prefix_lower, 1) = v_delimiter THEN
        v_upper_bound := left(v_prefix_lower, -1) || chr(ascii(v_delimiter) + 1);
    ELSE
        v_upper_bound := left(v_prefix_lower, -1) || chr(ascii(right(v_prefix_lower, 1)) + 1);
    END IF;

    -- Build batch query (dynamic SQL - called infrequently, amortized over many rows)
    IF v_is_asc THEN
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" >= $2 ' ||
                'AND lower(o.name) COLLATE "C" < $3 ORDER BY lower(o.name) COLLATE "C" ASC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" >= $2 ' ||
                'ORDER BY lower(o.name) COLLATE "C" ASC LIMIT $4';
        END IF;
    ELSE
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" < $2 ' ||
                'AND lower(o.name) COLLATE "C" >= $3 ORDER BY lower(o.name) COLLATE "C" DESC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" < $2 ' ||
                'ORDER BY lower(o.name) COLLATE "C" DESC LIMIT $4';
        END IF;
    END IF;

    -- Initialize seek position
    IF v_is_asc THEN
        v_next_seek := v_prefix_lower;
    ELSE
        -- DESC: find the last item in range first (static SQL)
        IF v_upper_bound IS NOT NULL THEN
            SELECT o.name INTO v_peek_name FROM storage.objects o
            WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_prefix_lower AND lower(o.name) COLLATE "C" < v_upper_bound
            ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
        ELSIF v_prefix_lower <> '' THEN
            SELECT o.name INTO v_peek_name FROM storage.objects o
            WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_prefix_lower
            ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
        ELSE
            SELECT o.name INTO v_peek_name FROM storage.objects o
            WHERE o.bucket_id = bucketname
            ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
        END IF;

        IF v_peek_name IS NOT NULL THEN
            v_next_seek := lower(v_peek_name) || v_delimiter;
        ELSE
            RETURN;
        END IF;
    END IF;

    -- ========================================================================
    -- MAIN LOOP: Hybrid peek-then-batch algorithm
    -- Uses STATIC SQL for peek (hot path) and DYNAMIC SQL for batch
    -- ========================================================================
    LOOP
        EXIT WHEN v_count >= v_limit;

        -- STEP 1: PEEK using STATIC SQL (plan cached, very fast)
        IF v_is_asc THEN
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_next_seek AND lower(o.name) COLLATE "C" < v_upper_bound
                ORDER BY lower(o.name) COLLATE "C" ASC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_next_seek
                ORDER BY lower(o.name) COLLATE "C" ASC LIMIT 1;
            END IF;
        ELSE
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" < v_next_seek AND lower(o.name) COLLATE "C" >= v_prefix_lower
                ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
            ELSIF v_prefix_lower <> '' THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" < v_next_seek AND lower(o.name) COLLATE "C" >= v_prefix_lower
                ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" < v_next_seek
                ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
            END IF;
        END IF;

        EXIT WHEN v_peek_name IS NULL;

        -- STEP 2: Check if this is a FOLDER or FILE
        v_common_prefix := storage.get_common_prefix(lower(v_peek_name), v_prefix_lower, v_delimiter);

        IF v_common_prefix IS NOT NULL THEN
            -- FOLDER: Handle offset, emit if needed, skip to next folder
            IF v_skipped < offsets THEN
                v_skipped := v_skipped + 1;
            ELSE
                name := split_part(rtrim(storage.get_common_prefix(v_peek_name, v_prefix, v_delimiter), v_delimiter), v_delimiter, levels);
                id := NULL;
                updated_at := NULL;
                created_at := NULL;
                last_accessed_at := NULL;
                metadata := NULL;
                RETURN NEXT;
                v_count := v_count + 1;
            END IF;

            -- Advance seek past the folder range
            IF v_is_asc THEN
                v_next_seek := lower(left(v_common_prefix, -1)) || chr(ascii(v_delimiter) + 1);
            ELSE
                v_next_seek := lower(v_common_prefix);
            END IF;
        ELSE
            -- FILE: Batch fetch using DYNAMIC SQL (overhead amortized over many rows)
            -- For ASC: upper_bound is the exclusive upper limit (< condition)
            -- For DESC: prefix_lower is the inclusive lower limit (>= condition)
            FOR v_current IN EXECUTE v_batch_query
                USING bucketname, v_next_seek,
                    CASE WHEN v_is_asc THEN COALESCE(v_upper_bound, v_prefix_lower) ELSE v_prefix_lower END, v_file_batch_size
            LOOP
                v_common_prefix := storage.get_common_prefix(lower(v_current.name), v_prefix_lower, v_delimiter);

                IF v_common_prefix IS NOT NULL THEN
                    -- Hit a folder: exit batch, let peek handle it
                    v_next_seek := lower(v_current.name);
                    EXIT;
                END IF;

                -- Handle offset skipping
                IF v_skipped < offsets THEN
                    v_skipped := v_skipped + 1;
                ELSE
                    -- Emit file
                    name := split_part(v_current.name, v_delimiter, levels);
                    id := v_current.id;
                    updated_at := v_current.updated_at;
                    created_at := v_current.created_at;
                    last_accessed_at := v_current.last_accessed_at;
                    metadata := v_current.metadata;
                    RETURN NEXT;
                    v_count := v_count + 1;
                END IF;

                -- Advance seek past this file
                IF v_is_asc THEN
                    v_next_seek := lower(v_current.name) || v_delimiter;
                ELSE
                    v_next_seek := lower(v_current.name);
                END IF;

                EXIT WHEN v_count >= v_limit;
            END LOOP;
        END IF;
    END LOOP;
END;
$_$;


ALTER FUNCTION storage.search(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text) OWNER TO supabase_storage_admin;

--
-- Name: search_by_timestamp(text, text, integer, integer, text, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search_by_timestamp(p_prefix text, p_bucket_id text, p_limit integer, p_level integer, p_start_after text, p_sort_order text, p_sort_column text, p_sort_column_after text) RETURNS TABLE(key text, name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
DECLARE
    v_cursor_op text;
    v_query text;
    v_prefix text;
BEGIN
    v_prefix := coalesce(p_prefix, '');

    IF p_sort_order = 'asc' THEN
        v_cursor_op := '>';
    ELSE
        v_cursor_op := '<';
    END IF;

    v_query := format($sql$
        WITH raw_objects AS (
            SELECT
                o.name AS obj_name,
                o.id AS obj_id,
                o.updated_at AS obj_updated_at,
                o.created_at AS obj_created_at,
                o.last_accessed_at AS obj_last_accessed_at,
                o.metadata AS obj_metadata,
                storage.get_common_prefix(o.name, $1, '/') AS common_prefix
            FROM storage.objects o
            WHERE o.bucket_id = $2
              AND o.name COLLATE "C" LIKE $1 || '%%'
        ),
        -- Aggregate common prefixes (folders)
        -- Both created_at and updated_at use MIN(obj_created_at) to match the old prefixes table behavior
        aggregated_prefixes AS (
            SELECT
                rtrim(common_prefix, '/') AS name,
                NULL::uuid AS id,
                MIN(obj_created_at) AS updated_at,
                MIN(obj_created_at) AS created_at,
                NULL::timestamptz AS last_accessed_at,
                NULL::jsonb AS metadata,
                TRUE AS is_prefix
            FROM raw_objects
            WHERE common_prefix IS NOT NULL
            GROUP BY common_prefix
        ),
        leaf_objects AS (
            SELECT
                obj_name AS name,
                obj_id AS id,
                obj_updated_at AS updated_at,
                obj_created_at AS created_at,
                obj_last_accessed_at AS last_accessed_at,
                obj_metadata AS metadata,
                FALSE AS is_prefix
            FROM raw_objects
            WHERE common_prefix IS NULL
        ),
        combined AS (
            SELECT * FROM aggregated_prefixes
            UNION ALL
            SELECT * FROM leaf_objects
        ),
        filtered AS (
            SELECT *
            FROM combined
            WHERE (
                $5 = ''
                OR ROW(
                    date_trunc('milliseconds', %I),
                    name COLLATE "C"
                ) %s ROW(
                    COALESCE(NULLIF($6, '')::timestamptz, 'epoch'::timestamptz),
                    $5
                )
            )
        )
        SELECT
            split_part(name, '/', $3) AS key,
            name,
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
        FROM filtered
        ORDER BY
            COALESCE(date_trunc('milliseconds', %I), 'epoch'::timestamptz) %s,
            name COLLATE "C" %s
        LIMIT $4
    $sql$,
        p_sort_column,
        v_cursor_op,
        p_sort_column,
        p_sort_order,
        p_sort_order
    );

    RETURN QUERY EXECUTE v_query
    USING v_prefix, p_bucket_id, p_level, p_limit, p_start_after, p_sort_column_after;
END;
$_$;


ALTER FUNCTION storage.search_by_timestamp(p_prefix text, p_bucket_id text, p_limit integer, p_level integer, p_start_after text, p_sort_order text, p_sort_column text, p_sort_column_after text) OWNER TO supabase_storage_admin;

--
-- Name: search_legacy_v1(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search_legacy_v1(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
declare
    v_order_by text;
    v_sort_order text;
begin
    case
        when sortcolumn = 'name' then
            v_order_by = 'name';
        when sortcolumn = 'updated_at' then
            v_order_by = 'updated_at';
        when sortcolumn = 'created_at' then
            v_order_by = 'created_at';
        when sortcolumn = 'last_accessed_at' then
            v_order_by = 'last_accessed_at';
        else
            v_order_by = 'name';
        end case;

    case
        when sortorder = 'asc' then
            v_sort_order = 'asc';
        when sortorder = 'desc' then
            v_sort_order = 'desc';
        else
            v_sort_order = 'asc';
        end case;

    v_order_by = v_order_by || ' ' || v_sort_order;

    return query execute
        'with folders as (
           select path_tokens[$1] as folder
           from storage.objects
             where objects.name ilike $2 || $3 || ''%''
               and bucket_id = $4
               and array_length(objects.path_tokens, 1) <> $1
           group by folder
           order by folder ' || v_sort_order || '
     )
     (select folder as "name",
            null as id,
            null as updated_at,
            null as created_at,
            null as last_accessed_at,
            null as metadata from folders)
     union all
     (select path_tokens[$1] as "name",
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
     from storage.objects
     where objects.name ilike $2 || $3 || ''%''
       and bucket_id = $4
       and array_length(objects.path_tokens, 1) = $1
     order by ' || v_order_by || ')
     limit $5
     offset $6' using levels, prefix, search, bucketname, limits, offsets;
end;
$_$;


ALTER FUNCTION storage.search_legacy_v1(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text) OWNER TO supabase_storage_admin;

--
-- Name: search_v2(text, text, integer, integer, text, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search_v2(prefix text, bucket_name text, limits integer DEFAULT 100, levels integer DEFAULT 1, start_after text DEFAULT ''::text, sort_order text DEFAULT 'asc'::text, sort_column text DEFAULT 'name'::text, sort_column_after text DEFAULT ''::text) RETURNS TABLE(key text, name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $$
DECLARE
    v_sort_col text;
    v_sort_ord text;
    v_limit int;
BEGIN
    -- Cap limit to maximum of 1500 records
    v_limit := LEAST(coalesce(limits, 100), 1500);

    -- Validate and normalize sort_order
    v_sort_ord := lower(coalesce(sort_order, 'asc'));
    IF v_sort_ord NOT IN ('asc', 'desc') THEN
        v_sort_ord := 'asc';
    END IF;

    -- Validate and normalize sort_column
    v_sort_col := lower(coalesce(sort_column, 'name'));
    IF v_sort_col NOT IN ('name', 'updated_at', 'created_at') THEN
        v_sort_col := 'name';
    END IF;

    -- Route to appropriate implementation
    IF v_sort_col = 'name' THEN
        -- Use list_objects_with_delimiter for name sorting (most efficient: O(k * log n))
        RETURN QUERY
        SELECT
            split_part(l.name, '/', levels) AS key,
            l.name AS name,
            l.id,
            l.updated_at,
            l.created_at,
            l.last_accessed_at,
            l.metadata
        FROM storage.list_objects_with_delimiter(
            bucket_name,
            coalesce(prefix, ''),
            '/',
            v_limit,
            start_after,
            '',
            v_sort_ord
        ) l;
    ELSE
        -- Use aggregation approach for timestamp sorting
        -- Not efficient for large datasets but supports correct pagination
        RETURN QUERY SELECT * FROM storage.search_by_timestamp(
            prefix, bucket_name, v_limit, levels, start_after,
            v_sort_ord, v_sort_col, sort_column_after
        );
    END IF;
END;
$$;


ALTER FUNCTION storage.search_v2(prefix text, bucket_name text, limits integer, levels integer, start_after text, sort_order text, sort_column text, sort_column_after text) OWNER TO supabase_storage_admin;

--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW; 
END;
$$;


ALTER FUNCTION storage.update_updated_at_column() OWNER TO supabase_storage_admin;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: audit_log_entries; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.audit_log_entries (
    instance_id uuid,
    id uuid NOT NULL,
    payload json,
    created_at timestamp with time zone,
    ip_address character varying(64) DEFAULT ''::character varying NOT NULL
);


ALTER TABLE auth.audit_log_entries OWNER TO supabase_auth_admin;

--
-- Name: TABLE audit_log_entries; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.audit_log_entries IS 'Auth: Audit trail for user actions.';


--
-- Name: custom_oauth_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.custom_oauth_providers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    provider_type text NOT NULL,
    identifier text NOT NULL,
    name text NOT NULL,
    client_id text NOT NULL,
    client_secret text NOT NULL,
    acceptable_client_ids text[] DEFAULT '{}'::text[] NOT NULL,
    scopes text[] DEFAULT '{}'::text[] NOT NULL,
    pkce_enabled boolean DEFAULT true NOT NULL,
    attribute_mapping jsonb DEFAULT '{}'::jsonb NOT NULL,
    authorization_params jsonb DEFAULT '{}'::jsonb NOT NULL,
    enabled boolean DEFAULT true NOT NULL,
    email_optional boolean DEFAULT false NOT NULL,
    issuer text,
    discovery_url text,
    skip_nonce_check boolean DEFAULT false NOT NULL,
    cached_discovery jsonb,
    discovery_cached_at timestamp with time zone,
    authorization_url text,
    token_url text,
    userinfo_url text,
    jwks_uri text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT custom_oauth_providers_authorization_url_https CHECK (((authorization_url IS NULL) OR (authorization_url ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_authorization_url_length CHECK (((authorization_url IS NULL) OR (char_length(authorization_url) <= 2048))),
    CONSTRAINT custom_oauth_providers_client_id_length CHECK (((char_length(client_id) >= 1) AND (char_length(client_id) <= 512))),
    CONSTRAINT custom_oauth_providers_discovery_url_length CHECK (((discovery_url IS NULL) OR (char_length(discovery_url) <= 2048))),
    CONSTRAINT custom_oauth_providers_identifier_format CHECK ((identifier ~ '^[a-z0-9][a-z0-9:-]{0,48}[a-z0-9]$'::text)),
    CONSTRAINT custom_oauth_providers_issuer_length CHECK (((issuer IS NULL) OR ((char_length(issuer) >= 1) AND (char_length(issuer) <= 2048)))),
    CONSTRAINT custom_oauth_providers_jwks_uri_https CHECK (((jwks_uri IS NULL) OR (jwks_uri ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_jwks_uri_length CHECK (((jwks_uri IS NULL) OR (char_length(jwks_uri) <= 2048))),
    CONSTRAINT custom_oauth_providers_name_length CHECK (((char_length(name) >= 1) AND (char_length(name) <= 100))),
    CONSTRAINT custom_oauth_providers_oauth2_requires_endpoints CHECK (((provider_type <> 'oauth2'::text) OR ((authorization_url IS NOT NULL) AND (token_url IS NOT NULL) AND (userinfo_url IS NOT NULL)))),
    CONSTRAINT custom_oauth_providers_oidc_discovery_url_https CHECK (((provider_type <> 'oidc'::text) OR (discovery_url IS NULL) OR (discovery_url ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_oidc_issuer_https CHECK (((provider_type <> 'oidc'::text) OR (issuer IS NULL) OR (issuer ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_oidc_requires_issuer CHECK (((provider_type <> 'oidc'::text) OR (issuer IS NOT NULL))),
    CONSTRAINT custom_oauth_providers_provider_type_check CHECK ((provider_type = ANY (ARRAY['oauth2'::text, 'oidc'::text]))),
    CONSTRAINT custom_oauth_providers_token_url_https CHECK (((token_url IS NULL) OR (token_url ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_token_url_length CHECK (((token_url IS NULL) OR (char_length(token_url) <= 2048))),
    CONSTRAINT custom_oauth_providers_userinfo_url_https CHECK (((userinfo_url IS NULL) OR (userinfo_url ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_userinfo_url_length CHECK (((userinfo_url IS NULL) OR (char_length(userinfo_url) <= 2048)))
);


ALTER TABLE auth.custom_oauth_providers OWNER TO supabase_auth_admin;

--
-- Name: flow_state; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.flow_state (
    id uuid NOT NULL,
    user_id uuid,
    auth_code text,
    code_challenge_method auth.code_challenge_method,
    code_challenge text,
    provider_type text NOT NULL,
    provider_access_token text,
    provider_refresh_token text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    authentication_method text NOT NULL,
    auth_code_issued_at timestamp with time zone,
    invite_token text,
    referrer text,
    oauth_client_state_id uuid,
    linking_target_id uuid,
    email_optional boolean DEFAULT false NOT NULL
);


ALTER TABLE auth.flow_state OWNER TO supabase_auth_admin;

--
-- Name: TABLE flow_state; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.flow_state IS 'Stores metadata for all OAuth/SSO login flows';


--
-- Name: identities; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.identities (
    provider_id text NOT NULL,
    user_id uuid NOT NULL,
    identity_data jsonb NOT NULL,
    provider text NOT NULL,
    last_sign_in_at timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    email text GENERATED ALWAYS AS (lower((identity_data ->> 'email'::text))) STORED,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE auth.identities OWNER TO supabase_auth_admin;

--
-- Name: TABLE identities; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.identities IS 'Auth: Stores identities associated to a user.';


--
-- Name: COLUMN identities.email; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.identities.email IS 'Auth: Email is a generated column that references the optional email property in the identity_data';


--
-- Name: instances; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.instances (
    id uuid NOT NULL,
    uuid uuid,
    raw_base_config text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE auth.instances OWNER TO supabase_auth_admin;

--
-- Name: TABLE instances; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.instances IS 'Auth: Manages users across multiple sites.';


--
-- Name: mfa_amr_claims; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_amr_claims (
    session_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    authentication_method text NOT NULL,
    id uuid NOT NULL
);


ALTER TABLE auth.mfa_amr_claims OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_amr_claims; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_amr_claims IS 'auth: stores authenticator method reference claims for multi factor authentication';


--
-- Name: mfa_challenges; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_challenges (
    id uuid NOT NULL,
    factor_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    verified_at timestamp with time zone,
    ip_address inet NOT NULL,
    otp_code text,
    web_authn_session_data jsonb
);


ALTER TABLE auth.mfa_challenges OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_challenges; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_challenges IS 'auth: stores metadata about challenge requests made';


--
-- Name: mfa_factors; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_factors (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    friendly_name text,
    factor_type auth.factor_type NOT NULL,
    status auth.factor_status NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    secret text,
    phone text,
    last_challenged_at timestamp with time zone,
    web_authn_credential jsonb,
    web_authn_aaguid uuid,
    last_webauthn_challenge_data jsonb
);


ALTER TABLE auth.mfa_factors OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_factors; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_factors IS 'auth: stores metadata about factors';


--
-- Name: COLUMN mfa_factors.last_webauthn_challenge_data; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.mfa_factors.last_webauthn_challenge_data IS 'Stores the latest WebAuthn challenge data including attestation/assertion for customer verification';


--
-- Name: oauth_authorizations; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.oauth_authorizations (
    id uuid NOT NULL,
    authorization_id text NOT NULL,
    client_id uuid NOT NULL,
    user_id uuid,
    redirect_uri text NOT NULL,
    scope text NOT NULL,
    state text,
    resource text,
    code_challenge text,
    code_challenge_method auth.code_challenge_method,
    response_type auth.oauth_response_type DEFAULT 'code'::auth.oauth_response_type NOT NULL,
    status auth.oauth_authorization_status DEFAULT 'pending'::auth.oauth_authorization_status NOT NULL,
    authorization_code text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    expires_at timestamp with time zone DEFAULT (now() + '00:03:00'::interval) NOT NULL,
    approved_at timestamp with time zone,
    nonce text,
    CONSTRAINT oauth_authorizations_authorization_code_length CHECK ((char_length(authorization_code) <= 255)),
    CONSTRAINT oauth_authorizations_code_challenge_length CHECK ((char_length(code_challenge) <= 128)),
    CONSTRAINT oauth_authorizations_expires_at_future CHECK ((expires_at > created_at)),
    CONSTRAINT oauth_authorizations_nonce_length CHECK ((char_length(nonce) <= 255)),
    CONSTRAINT oauth_authorizations_redirect_uri_length CHECK ((char_length(redirect_uri) <= 2048)),
    CONSTRAINT oauth_authorizations_resource_length CHECK ((char_length(resource) <= 2048)),
    CONSTRAINT oauth_authorizations_scope_length CHECK ((char_length(scope) <= 4096)),
    CONSTRAINT oauth_authorizations_state_length CHECK ((char_length(state) <= 4096))
);


ALTER TABLE auth.oauth_authorizations OWNER TO supabase_auth_admin;

--
-- Name: oauth_client_states; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.oauth_client_states (
    id uuid NOT NULL,
    provider_type text NOT NULL,
    code_verifier text,
    created_at timestamp with time zone NOT NULL
);


ALTER TABLE auth.oauth_client_states OWNER TO supabase_auth_admin;

--
-- Name: TABLE oauth_client_states; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.oauth_client_states IS 'Stores OAuth states for third-party provider authentication flows where Supabase acts as the OAuth client.';


--
-- Name: oauth_clients; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.oauth_clients (
    id uuid NOT NULL,
    client_secret_hash text,
    registration_type auth.oauth_registration_type NOT NULL,
    redirect_uris text NOT NULL,
    grant_types text NOT NULL,
    client_name text,
    client_uri text,
    logo_uri text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    client_type auth.oauth_client_type DEFAULT 'confidential'::auth.oauth_client_type NOT NULL,
    token_endpoint_auth_method text NOT NULL,
    CONSTRAINT oauth_clients_client_name_length CHECK ((char_length(client_name) <= 1024)),
    CONSTRAINT oauth_clients_client_uri_length CHECK ((char_length(client_uri) <= 2048)),
    CONSTRAINT oauth_clients_logo_uri_length CHECK ((char_length(logo_uri) <= 2048)),
    CONSTRAINT oauth_clients_token_endpoint_auth_method_check CHECK ((token_endpoint_auth_method = ANY (ARRAY['client_secret_basic'::text, 'client_secret_post'::text, 'none'::text])))
);


ALTER TABLE auth.oauth_clients OWNER TO supabase_auth_admin;

--
-- Name: oauth_consents; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.oauth_consents (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    client_id uuid NOT NULL,
    scopes text NOT NULL,
    granted_at timestamp with time zone DEFAULT now() NOT NULL,
    revoked_at timestamp with time zone,
    CONSTRAINT oauth_consents_revoked_after_granted CHECK (((revoked_at IS NULL) OR (revoked_at >= granted_at))),
    CONSTRAINT oauth_consents_scopes_length CHECK ((char_length(scopes) <= 2048)),
    CONSTRAINT oauth_consents_scopes_not_empty CHECK ((char_length(TRIM(BOTH FROM scopes)) > 0))
);


ALTER TABLE auth.oauth_consents OWNER TO supabase_auth_admin;

--
-- Name: one_time_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.one_time_tokens (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    token_type auth.one_time_token_type NOT NULL,
    token_hash text NOT NULL,
    relates_to text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT one_time_tokens_token_hash_check CHECK ((char_length(token_hash) > 0))
);


ALTER TABLE auth.one_time_tokens OWNER TO supabase_auth_admin;

--
-- Name: refresh_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.refresh_tokens (
    instance_id uuid,
    id bigint NOT NULL,
    token character varying(255),
    user_id character varying(255),
    revoked boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    parent character varying(255),
    session_id uuid
);


ALTER TABLE auth.refresh_tokens OWNER TO supabase_auth_admin;

--
-- Name: TABLE refresh_tokens; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.refresh_tokens IS 'Auth: Store of tokens used to refresh JWT tokens once they expire.';


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: auth; Owner: supabase_auth_admin
--

CREATE SEQUENCE auth.refresh_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE auth.refresh_tokens_id_seq OWNER TO supabase_auth_admin;

--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: auth; Owner: supabase_auth_admin
--

ALTER SEQUENCE auth.refresh_tokens_id_seq OWNED BY auth.refresh_tokens.id;


--
-- Name: saml_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.saml_providers (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    entity_id text NOT NULL,
    metadata_xml text NOT NULL,
    metadata_url text,
    attribute_mapping jsonb,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    name_id_format text,
    CONSTRAINT "entity_id not empty" CHECK ((char_length(entity_id) > 0)),
    CONSTRAINT "metadata_url not empty" CHECK (((metadata_url = NULL::text) OR (char_length(metadata_url) > 0))),
    CONSTRAINT "metadata_xml not empty" CHECK ((char_length(metadata_xml) > 0))
);


ALTER TABLE auth.saml_providers OWNER TO supabase_auth_admin;

--
-- Name: TABLE saml_providers; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.saml_providers IS 'Auth: Manages SAML Identity Provider connections.';


--
-- Name: saml_relay_states; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.saml_relay_states (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    request_id text NOT NULL,
    for_email text,
    redirect_to text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    flow_state_id uuid,
    CONSTRAINT "request_id not empty" CHECK ((char_length(request_id) > 0))
);


ALTER TABLE auth.saml_relay_states OWNER TO supabase_auth_admin;

--
-- Name: TABLE saml_relay_states; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.saml_relay_states IS 'Auth: Contains SAML Relay State information for each Service Provider initiated login.';


--
-- Name: schema_migrations; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.schema_migrations (
    version character varying(255) NOT NULL
);


ALTER TABLE auth.schema_migrations OWNER TO supabase_auth_admin;

--
-- Name: TABLE schema_migrations; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.schema_migrations IS 'Auth: Manages updates to the auth system.';


--
-- Name: sessions; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sessions (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    factor_id uuid,
    aal auth.aal_level,
    not_after timestamp with time zone,
    refreshed_at timestamp without time zone,
    user_agent text,
    ip inet,
    tag text,
    oauth_client_id uuid,
    refresh_token_hmac_key text,
    refresh_token_counter bigint,
    scopes text,
    CONSTRAINT sessions_scopes_length CHECK ((char_length(scopes) <= 4096))
);


ALTER TABLE auth.sessions OWNER TO supabase_auth_admin;

--
-- Name: TABLE sessions; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sessions IS 'Auth: Stores session data associated to a user.';


--
-- Name: COLUMN sessions.not_after; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sessions.not_after IS 'Auth: Not after is a nullable column that contains a timestamp after which the session should be regarded as expired.';


--
-- Name: COLUMN sessions.refresh_token_hmac_key; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sessions.refresh_token_hmac_key IS 'Holds a HMAC-SHA256 key used to sign refresh tokens for this session.';


--
-- Name: COLUMN sessions.refresh_token_counter; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sessions.refresh_token_counter IS 'Holds the ID (counter) of the last issued refresh token.';


--
-- Name: sso_domains; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sso_domains (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    domain text NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT "domain not empty" CHECK ((char_length(domain) > 0))
);


ALTER TABLE auth.sso_domains OWNER TO supabase_auth_admin;

--
-- Name: TABLE sso_domains; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sso_domains IS 'Auth: Manages SSO email address domain mapping to an SSO Identity Provider.';


--
-- Name: sso_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sso_providers (
    id uuid NOT NULL,
    resource_id text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    disabled boolean,
    CONSTRAINT "resource_id not empty" CHECK (((resource_id = NULL::text) OR (char_length(resource_id) > 0)))
);


ALTER TABLE auth.sso_providers OWNER TO supabase_auth_admin;

--
-- Name: TABLE sso_providers; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sso_providers IS 'Auth: Manages SSO identity provider information; see saml_providers for SAML.';


--
-- Name: COLUMN sso_providers.resource_id; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sso_providers.resource_id IS 'Auth: Uniquely identifies a SSO provider according to a user-chosen resource ID (case insensitive), useful in infrastructure as code.';


--
-- Name: users; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.users (
    instance_id uuid,
    id uuid NOT NULL,
    aud character varying(255),
    role character varying(255),
    email character varying(255),
    encrypted_password character varying(255),
    email_confirmed_at timestamp with time zone,
    invited_at timestamp with time zone,
    confirmation_token character varying(255),
    confirmation_sent_at timestamp with time zone,
    recovery_token character varying(255),
    recovery_sent_at timestamp with time zone,
    email_change_token_new character varying(255),
    email_change character varying(255),
    email_change_sent_at timestamp with time zone,
    last_sign_in_at timestamp with time zone,
    raw_app_meta_data jsonb,
    raw_user_meta_data jsonb,
    is_super_admin boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    phone text DEFAULT NULL::character varying,
    phone_confirmed_at timestamp with time zone,
    phone_change text DEFAULT ''::character varying,
    phone_change_token character varying(255) DEFAULT ''::character varying,
    phone_change_sent_at timestamp with time zone,
    confirmed_at timestamp with time zone GENERATED ALWAYS AS (LEAST(email_confirmed_at, phone_confirmed_at)) STORED,
    email_change_token_current character varying(255) DEFAULT ''::character varying,
    email_change_confirm_status smallint DEFAULT 0,
    banned_until timestamp with time zone,
    reauthentication_token character varying(255) DEFAULT ''::character varying,
    reauthentication_sent_at timestamp with time zone,
    is_sso_user boolean DEFAULT false NOT NULL,
    deleted_at timestamp with time zone,
    is_anonymous boolean DEFAULT false NOT NULL,
    CONSTRAINT users_email_change_confirm_status_check CHECK (((email_change_confirm_status >= 0) AND (email_change_confirm_status <= 2)))
);


ALTER TABLE auth.users OWNER TO supabase_auth_admin;

--
-- Name: TABLE users; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.users IS 'Auth: Stores user login data within a secure schema.';


--
-- Name: COLUMN users.is_sso_user; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.users.is_sso_user IS 'Auth: Set this column to true when the account comes from SSO. These accounts can have duplicate emails.';


--
-- Name: webauthn_challenges; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.webauthn_challenges (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    challenge_type text NOT NULL,
    session_data jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    CONSTRAINT webauthn_challenges_challenge_type_check CHECK ((challenge_type = ANY (ARRAY['signup'::text, 'registration'::text, 'authentication'::text])))
);


ALTER TABLE auth.webauthn_challenges OWNER TO supabase_auth_admin;

--
-- Name: webauthn_credentials; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.webauthn_credentials (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    credential_id bytea NOT NULL,
    public_key bytea NOT NULL,
    attestation_type text DEFAULT ''::text NOT NULL,
    aaguid uuid,
    sign_count bigint DEFAULT 0 NOT NULL,
    transports jsonb DEFAULT '[]'::jsonb NOT NULL,
    backup_eligible boolean DEFAULT false NOT NULL,
    backed_up boolean DEFAULT false NOT NULL,
    friendly_name text DEFAULT ''::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    last_used_at timestamp with time zone
);


ALTER TABLE auth.webauthn_credentials OWNER TO supabase_auth_admin;

--
-- Name: clients; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.clients (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    name text NOT NULL,
    email text,
    phone text,
    address text,
    created_at timestamp with time zone DEFAULT now(),
    document text,
    avatar text
);


ALTER TABLE public.clients OWNER TO postgres;

--
-- Name: contracts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contracts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    quote_id uuid NOT NULL,
    content text,
    status text DEFAULT 'DRAFT'::text,
    client_signature text,
    signed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT contracts_status_check CHECK ((status = ANY (ARRAY['DRAFT'::text, 'SENT'::text, 'VIEWED'::text, 'SIGNED'::text, 'REJECTED'::text])))
);


ALTER TABLE public.contracts OWNER TO postgres;

--
-- Name: feedbacks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.feedbacks (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    email text,
    nps integer,
    general text,
    improvements text,
    ratings jsonb,
    comments jsonb,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


ALTER TABLE public.feedbacks OWNER TO postgres;

--
-- Name: profiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.profiles (
    id uuid NOT NULL,
    company_name text,
    logo_url text,
    plan_type text DEFAULT 'STARTER'::text,
    whatsapp text,
    created_at timestamp with time zone DEFAULT now(),
    logo text,
    document text,
    phone text,
    address text,
    tech_signature text,
    material_catalog jsonb DEFAULT '[]'::jsonb,
    contract_templates jsonb DEFAULT '[]'::jsonb,
    email text,
    name text,
    subscription_status text DEFAULT 'trial'::text,
    trial_ends_at timestamp with time zone DEFAULT (now() + '60 days'::interval),
    pix_key text,
    bank_info text,
    subscription_ends_at timestamp with time zone,
    updated_at timestamp with time zone DEFAULT now(),
    subscription_plan text,
    subscription_activated_at timestamp with time zone,
    CONSTRAINT profiles_plan_type_check CHECK ((plan_type = ANY (ARRAY['STARTER'::text, 'PRO'::text])))
);


ALTER TABLE public.profiles OWNER TO postgres;

--
-- Name: quotes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.quotes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    client_id uuid,
    number text NOT NULL,
    status text DEFAULT 'DRAFT'::text,
    services jsonb DEFAULT '[]'::jsonb,
    materials jsonb DEFAULT '[]'::jsonb,
    total_value numeric(10,2) DEFAULT 0,
    public_token uuid DEFAULT gen_random_uuid(),
    viewed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    company_info jsonb,
    date date,
    valid_until date,
    warranty_duration integer,
    payment_terms text,
    completion_date timestamp with time zone,
    warranty_until timestamp with time zone,
    signature_data text,
    contract_number text,
    access_password text,
    CONSTRAINT quotes_status_check CHECK ((status = ANY (ARRAY['DRAFT'::text, 'SENT'::text, 'VIEWED'::text, 'APPROVED'::text, 'REJECTED'::text, 'COMPLETED'::text])))
);


ALTER TABLE public.quotes OWNER TO postgres;

--
-- Name: subscription_audit_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.subscription_audit_logs (
    id bigint NOT NULL,
    user_id uuid NOT NULL,
    event text NOT NULL,
    plan text,
    details jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.subscription_audit_logs OWNER TO postgres;

--
-- Name: subscription_audit_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.subscription_audit_logs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.subscription_audit_logs_id_seq OWNER TO postgres;

--
-- Name: subscription_audit_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.subscription_audit_logs_id_seq OWNED BY public.subscription_audit_logs.id;


--
-- Name: messages; Type: TABLE; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE TABLE realtime.messages (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
)
PARTITION BY RANGE (inserted_at);


ALTER TABLE realtime.messages OWNER TO supabase_realtime_admin;

--
-- Name: schema_migrations; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.schema_migrations (
    version bigint NOT NULL,
    inserted_at timestamp(0) without time zone
);


ALTER TABLE realtime.schema_migrations OWNER TO supabase_admin;

--
-- Name: subscription; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.subscription (
    id bigint NOT NULL,
    subscription_id uuid NOT NULL,
    entity regclass NOT NULL,
    filters realtime.user_defined_filter[] DEFAULT '{}'::realtime.user_defined_filter[] NOT NULL,
    claims jsonb NOT NULL,
    claims_role regrole GENERATED ALWAYS AS (realtime.to_regrole((claims ->> 'role'::text))) STORED NOT NULL,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    action_filter text DEFAULT '*'::text,
    CONSTRAINT subscription_action_filter_check CHECK ((action_filter = ANY (ARRAY['*'::text, 'INSERT'::text, 'UPDATE'::text, 'DELETE'::text])))
);


ALTER TABLE realtime.subscription OWNER TO supabase_admin;

--
-- Name: subscription_id_seq; Type: SEQUENCE; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE realtime.subscription ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME realtime.subscription_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: buckets; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.buckets (
    id text NOT NULL,
    name text NOT NULL,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    public boolean DEFAULT false,
    avif_autodetection boolean DEFAULT false,
    file_size_limit bigint,
    allowed_mime_types text[],
    owner_id text,
    type storage.buckettype DEFAULT 'STANDARD'::storage.buckettype NOT NULL
);


ALTER TABLE storage.buckets OWNER TO supabase_storage_admin;

--
-- Name: COLUMN buckets.owner; Type: COMMENT; Schema: storage; Owner: supabase_storage_admin
--

COMMENT ON COLUMN storage.buckets.owner IS 'Field is deprecated, use owner_id instead';


--
-- Name: buckets_analytics; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.buckets_analytics (
    name text NOT NULL,
    type storage.buckettype DEFAULT 'ANALYTICS'::storage.buckettype NOT NULL,
    format text DEFAULT 'ICEBERG'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE storage.buckets_analytics OWNER TO supabase_storage_admin;

--
-- Name: buckets_vectors; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.buckets_vectors (
    id text NOT NULL,
    type storage.buckettype DEFAULT 'VECTOR'::storage.buckettype NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE storage.buckets_vectors OWNER TO supabase_storage_admin;

--
-- Name: migrations; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.migrations (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    hash character varying(40) NOT NULL,
    executed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE storage.migrations OWNER TO supabase_storage_admin;

--
-- Name: objects; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.objects (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    bucket_id text,
    name text,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    last_accessed_at timestamp with time zone DEFAULT now(),
    metadata jsonb,
    path_tokens text[] GENERATED ALWAYS AS (string_to_array(name, '/'::text)) STORED,
    version text,
    owner_id text,
    user_metadata jsonb
);


ALTER TABLE storage.objects OWNER TO supabase_storage_admin;

--
-- Name: COLUMN objects.owner; Type: COMMENT; Schema: storage; Owner: supabase_storage_admin
--

COMMENT ON COLUMN storage.objects.owner IS 'Field is deprecated, use owner_id instead';


--
-- Name: s3_multipart_uploads; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.s3_multipart_uploads (
    id text NOT NULL,
    in_progress_size bigint DEFAULT 0 NOT NULL,
    upload_signature text NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    version text NOT NULL,
    owner_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_metadata jsonb,
    metadata jsonb
);


ALTER TABLE storage.s3_multipart_uploads OWNER TO supabase_storage_admin;

--
-- Name: s3_multipart_uploads_parts; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.s3_multipart_uploads_parts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    upload_id text NOT NULL,
    size bigint DEFAULT 0 NOT NULL,
    part_number integer NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    etag text NOT NULL,
    owner_id text,
    version text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE storage.s3_multipart_uploads_parts OWNER TO supabase_storage_admin;

--
-- Name: vector_indexes; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.vector_indexes (
    id text DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL COLLATE pg_catalog."C",
    bucket_id text NOT NULL,
    data_type text NOT NULL,
    dimension integer NOT NULL,
    distance_metric text NOT NULL,
    metadata_configuration jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE storage.vector_indexes OWNER TO supabase_storage_admin;

--
-- Name: schema_migrations; Type: TABLE; Schema: supabase_migrations; Owner: postgres
--

CREATE TABLE supabase_migrations.schema_migrations (
    version text NOT NULL,
    statements text[],
    name text,
    created_by text,
    idempotency_key text,
    rollback text[]
);


ALTER TABLE supabase_migrations.schema_migrations OWNER TO postgres;

--
-- Name: refresh_tokens id; Type: DEFAULT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('auth.refresh_tokens_id_seq'::regclass);


--
-- Name: subscription_audit_logs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscription_audit_logs ALTER COLUMN id SET DEFAULT nextval('public.subscription_audit_logs_id_seq'::regclass);


--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) FROM stdin;
\.


--
-- Data for Name: custom_oauth_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.custom_oauth_providers (id, provider_type, identifier, name, client_id, client_secret, acceptable_client_ids, scopes, pkce_enabled, attribute_mapping, authorization_params, enabled, email_optional, issuer, discovery_url, skip_nonce_check, cached_discovery, discovery_cached_at, authorization_url, token_url, userinfo_url, jwks_uri, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.flow_state (id, user_id, auth_code, code_challenge_method, code_challenge, provider_type, provider_access_token, provider_refresh_token, created_at, updated_at, authentication_method, auth_code_issued_at, invite_token, referrer, oauth_client_state_id, linking_target_id, email_optional) FROM stdin;
\.


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, id) FROM stdin;
6e34d11b-a290-417f-8b33-d8c0083bf0b0	6e34d11b-a290-417f-8b33-d8c0083bf0b0	{"sub": "6e34d11b-a290-417f-8b33-d8c0083bf0b0", "email": "kmkz.clan@gmail.com", "company_name": "RNB Consultoria", "email_verified": true, "phone_verified": false}	email	2026-02-08 03:22:09.947403+00	2026-02-08 03:22:09.94745+00	2026-02-08 03:22:09.94745+00	25f6b6bc-c0cd-438a-a5a3-153bba5d779f
fbe71a65-4f7b-4519-8afd-5fb610daff7c	fbe71a65-4f7b-4519-8afd-5fb610daff7c	{"sub": "fbe71a65-4f7b-4519-8afd-5fb610daff7c", "email": "kmkz.clan+10@gmail.com", "company_name": "Minha Empresa", "email_verified": true, "phone_verified": false}	email	2026-02-20 01:19:57.428944+00	2026-02-20 01:19:57.429029+00	2026-02-20 01:19:57.429029+00	6b820c07-b12f-4799-a037-23081da8b7ba
8664839b-c487-40b6-ac2d-31defc586c27	8664839b-c487-40b6-ac2d-31defc586c27	{"sub": "8664839b-c487-40b6-ac2d-31defc586c27", "email": "dixx.gnomio@gmail.com", "company_name": "Borges_phones", "email_verified": true, "phone_verified": false}	email	2026-03-08 16:50:53.099501+00	2026-03-08 16:50:53.100128+00	2026-03-08 16:50:53.100128+00	2aef1b07-6ec2-4338-b999-1b0f043632b7
\.


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.instances (id, uuid, raw_base_config, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_amr_claims (session_id, created_at, updated_at, authentication_method, id) FROM stdin;
fe8dbaff-8668-41b8-812f-58a8164f06da	2026-03-13 13:30:17.523005+00	2026-03-13 13:30:17.523005+00	password	716c7457-2a69-434c-b77c-510153c51f48
8e681c1a-7d06-4680-a224-7e833423bd61	2026-03-13 13:31:37.127856+00	2026-03-13 13:31:37.127856+00	password	a185b9c9-5144-4266-9198-c94eca9b1f43
0bfade73-065e-44f4-8da3-9be582c08be5	2026-03-13 13:42:58.612871+00	2026-03-13 13:42:58.612871+00	password	588826f9-eec6-4b71-9561-96fdfe8e51ed
a081bf6c-7126-4b39-9c0d-03567de46fea	2026-03-29 03:42:13.048582+00	2026-03-29 03:42:13.048582+00	password	f092f775-af73-4d6e-a593-d9caebb6684c
b909b9ef-05ec-4c92-9b1b-f922adbb0f96	2026-04-15 16:10:10.035631+00	2026-04-15 16:10:10.035631+00	password	491e4dc3-d505-4a11-8a2f-1c03a3da6692
a4aad5d1-6f15-4414-aebb-3496e92985a1	2026-04-15 16:17:45.929342+00	2026-04-15 16:17:45.929342+00	password	2eea6929-d4d4-4cb6-a9c0-8bdf59533a0b
b0165391-528d-4d98-a34e-49f793f92703	2026-04-16 20:09:11.031752+00	2026-04-16 20:09:11.031752+00	password	30a962d0-d75c-4b3b-a4e3-37990c621dd1
1ebf1a45-b5c7-405e-8b63-a221e3936dfd	2026-03-08 16:51:18.437296+00	2026-03-08 16:51:18.437296+00	otp	2c47440f-0a6b-4572-bd15-3dc3cecc36b2
f522ecc8-b8bb-498f-8d55-a2df9cb1fae4	2026-03-08 16:52:04.27042+00	2026-03-08 16:52:04.27042+00	password	8cd4cf5e-ee21-4b1e-abde-2931ea5b57cf
\.


--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_challenges (id, factor_id, created_at, verified_at, ip_address, otp_code, web_authn_session_data) FROM stdin;
\.


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_factors (id, user_id, friendly_name, factor_type, status, created_at, updated_at, secret, phone, last_challenged_at, web_authn_credential, web_authn_aaguid, last_webauthn_challenge_data) FROM stdin;
\.


--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.oauth_authorizations (id, authorization_id, client_id, user_id, redirect_uri, scope, state, resource, code_challenge, code_challenge_method, response_type, status, authorization_code, created_at, expires_at, approved_at, nonce) FROM stdin;
\.


--
-- Data for Name: oauth_client_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.oauth_client_states (id, provider_type, code_verifier, created_at) FROM stdin;
\.


--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.oauth_clients (id, client_secret_hash, registration_type, redirect_uris, grant_types, client_name, client_uri, logo_uri, created_at, updated_at, deleted_at, client_type, token_endpoint_auth_method) FROM stdin;
\.


--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.oauth_consents (id, user_id, client_id, scopes, granted_at, revoked_at) FROM stdin;
\.


--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.one_time_tokens (id, user_id, token_type, token_hash, relates_to, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.refresh_tokens (instance_id, id, token, user_id, revoked, created_at, updated_at, parent, session_id) FROM stdin;
00000000-0000-0000-0000-000000000000	116	olk4ipwbltv2	6e34d11b-a290-417f-8b33-d8c0083bf0b0	f	2026-03-13 13:30:17.478486+00	2026-03-13 13:30:17.478486+00	\N	fe8dbaff-8668-41b8-812f-58a8164f06da
00000000-0000-0000-0000-000000000000	117	ff4nkiau7euk	6e34d11b-a290-417f-8b33-d8c0083bf0b0	f	2026-03-13 13:31:37.107508+00	2026-03-13 13:31:37.107508+00	\N	8e681c1a-7d06-4680-a224-7e833423bd61
00000000-0000-0000-0000-000000000000	118	xws7frauepba	6e34d11b-a290-417f-8b33-d8c0083bf0b0	t	2026-03-13 13:42:58.606007+00	2026-03-29 03:41:49.369988+00	\N	0bfade73-065e-44f4-8da3-9be582c08be5
00000000-0000-0000-0000-000000000000	119	7r7acv32opyc	6e34d11b-a290-417f-8b33-d8c0083bf0b0	f	2026-03-29 03:41:49.388027+00	2026-03-29 03:41:49.388027+00	xws7frauepba	0bfade73-065e-44f4-8da3-9be582c08be5
00000000-0000-0000-0000-000000000000	120	b35vdisiq2l6	6e34d11b-a290-417f-8b33-d8c0083bf0b0	t	2026-03-29 03:42:13.047272+00	2026-03-29 20:16:03.055226+00	\N	a081bf6c-7126-4b39-9c0d-03567de46fea
00000000-0000-0000-0000-000000000000	121	yoz7wawuxnge	6e34d11b-a290-417f-8b33-d8c0083bf0b0	t	2026-03-29 20:16:03.07299+00	2026-03-30 10:46:08.180856+00	b35vdisiq2l6	a081bf6c-7126-4b39-9c0d-03567de46fea
00000000-0000-0000-0000-000000000000	122	aeonviv7maju	6e34d11b-a290-417f-8b33-d8c0083bf0b0	t	2026-03-30 10:46:08.212347+00	2026-03-31 12:02:16.294954+00	yoz7wawuxnge	a081bf6c-7126-4b39-9c0d-03567de46fea
00000000-0000-0000-0000-000000000000	123	lovtro6ut3a7	6e34d11b-a290-417f-8b33-d8c0083bf0b0	t	2026-03-31 12:02:16.325527+00	2026-03-31 16:51:23.895143+00	aeonviv7maju	a081bf6c-7126-4b39-9c0d-03567de46fea
00000000-0000-0000-0000-000000000000	124	eb7bu65pfvi6	6e34d11b-a290-417f-8b33-d8c0083bf0b0	t	2026-03-31 16:51:23.907391+00	2026-04-01 17:47:29.711941+00	lovtro6ut3a7	a081bf6c-7126-4b39-9c0d-03567de46fea
00000000-0000-0000-0000-000000000000	125	jbqtval2g4dq	6e34d11b-a290-417f-8b33-d8c0083bf0b0	t	2026-04-01 17:47:29.737551+00	2026-04-04 01:31:30.58339+00	eb7bu65pfvi6	a081bf6c-7126-4b39-9c0d-03567de46fea
00000000-0000-0000-0000-000000000000	126	xra5aka4sel6	6e34d11b-a290-417f-8b33-d8c0083bf0b0	f	2026-04-04 01:31:30.608704+00	2026-04-04 01:31:30.608704+00	jbqtval2g4dq	a081bf6c-7126-4b39-9c0d-03567de46fea
00000000-0000-0000-0000-000000000000	127	phol4s3233be	6e34d11b-a290-417f-8b33-d8c0083bf0b0	f	2026-04-15 16:10:10.008938+00	2026-04-15 16:10:10.008938+00	\N	b909b9ef-05ec-4c92-9b1b-f922adbb0f96
00000000-0000-0000-0000-000000000000	128	dtgyr6qmvv77	6e34d11b-a290-417f-8b33-d8c0083bf0b0	f	2026-04-15 16:17:45.919505+00	2026-04-15 16:17:45.919505+00	\N	a4aad5d1-6f15-4414-aebb-3496e92985a1
00000000-0000-0000-0000-000000000000	129	fauvuizewd6s	6e34d11b-a290-417f-8b33-d8c0083bf0b0	t	2026-04-16 20:09:11.003316+00	2026-04-16 22:10:04.046658+00	\N	b0165391-528d-4d98-a34e-49f793f92703
00000000-0000-0000-0000-000000000000	130	qiqiiecckuch	6e34d11b-a290-417f-8b33-d8c0083bf0b0	f	2026-04-16 22:10:04.070683+00	2026-04-16 22:10:04.070683+00	fauvuizewd6s	b0165391-528d-4d98-a34e-49f793f92703
00000000-0000-0000-0000-000000000000	98	adbvblzkno3x	8664839b-c487-40b6-ac2d-31defc586c27	f	2026-03-08 16:51:18.405534+00	2026-03-08 16:51:18.405534+00	\N	1ebf1a45-b5c7-405e-8b63-a221e3936dfd
00000000-0000-0000-0000-000000000000	99	wqe2jxs7wjmc	8664839b-c487-40b6-ac2d-31defc586c27	f	2026-03-08 16:52:04.268+00	2026-03-08 16:52:04.268+00	\N	f522ecc8-b8bb-498f-8d55-a2df9cb1fae4
\.


--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.saml_providers (id, sso_provider_id, entity_id, metadata_xml, metadata_url, attribute_mapping, created_at, updated_at, name_id_format) FROM stdin;
\.


--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.saml_relay_states (id, sso_provider_id, request_id, for_email, redirect_to, created_at, updated_at, flow_state_id) FROM stdin;
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.schema_migrations (version) FROM stdin;
20171026211738
20171026211808
20171026211834
20180103212743
20180108183307
20180119214651
20180125194653
00
20210710035447
20210722035447
20210730183235
20210909172000
20210927181326
20211122151130
20211124214934
20211202183645
20220114185221
20220114185340
20220224000811
20220323170000
20220429102000
20220531120530
20220614074223
20220811173540
20221003041349
20221003041400
20221011041400
20221020193600
20221021073300
20221021082433
20221027105023
20221114143122
20221114143410
20221125140132
20221208132122
20221215195500
20221215195800
20221215195900
20230116124310
20230116124412
20230131181311
20230322519590
20230402418590
20230411005111
20230508135423
20230523124323
20230818113222
20230914180801
20231027141322
20231114161723
20231117164230
20240115144230
20240214120130
20240306115329
20240314092811
20240427152123
20240612123726
20240729123726
20240802193726
20240806073726
20241009103726
20250717082212
20250731150234
20250804100000
20250901200500
20250903112500
20250904133000
20250925093508
20251007112900
20251104100000
20251111201300
20251201000000
20260115000000
20260121000000
20260219120000
20260302000000
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sessions (id, user_id, created_at, updated_at, factor_id, aal, not_after, refreshed_at, user_agent, ip, tag, oauth_client_id, refresh_token_hmac_key, refresh_token_counter, scopes) FROM stdin;
fe8dbaff-8668-41b8-812f-58a8164f06da	6e34d11b-a290-417f-8b33-d8c0083bf0b0	2026-03-13 13:30:17.433549+00	2026-03-13 13:30:17.433549+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 OPR/127.0.0.0	187.7.162.44	\N	\N	\N	\N	\N
8e681c1a-7d06-4680-a224-7e833423bd61	6e34d11b-a290-417f-8b33-d8c0083bf0b0	2026-03-13 13:31:37.073112+00	2026-03-13 13:31:37.073112+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 OPR/127.0.0.0	187.7.162.44	\N	\N	\N	\N	\N
0bfade73-065e-44f4-8da3-9be582c08be5	6e34d11b-a290-417f-8b33-d8c0083bf0b0	2026-03-13 13:42:58.599913+00	2026-03-29 03:41:49.424758+00	\N	aal1	\N	2026-03-29 03:41:49.424653	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 OPR/128.0.0.0	187.7.162.44	\N	\N	\N	\N	\N
1ebf1a45-b5c7-405e-8b63-a221e3936dfd	8664839b-c487-40b6-ac2d-31defc586c27	2026-03-08 16:51:18.389548+00	2026-03-08 16:51:18.389548+00	\N	aal1	\N	\N	Mozilla/5.0 (iPhone; CPU iPhone OS 26_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) GSA/410.0.875971614 Mobile/15E148 Safari/604.1	138.117.221.41	\N	\N	\N	\N	\N
f522ecc8-b8bb-498f-8d55-a2df9cb1fae4	8664839b-c487-40b6-ac2d-31defc586c27	2026-03-08 16:52:04.266692+00	2026-03-08 16:52:04.266692+00	\N	aal1	\N	\N	Mozilla/5.0 (iPhone; CPU iPhone OS 26_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) GSA/410.0.875971614 Mobile/15E148 Safari/604.1	138.117.221.41	\N	\N	\N	\N	\N
a081bf6c-7126-4b39-9c0d-03567de46fea	6e34d11b-a290-417f-8b33-d8c0083bf0b0	2026-03-29 03:42:13.037459+00	2026-04-04 01:31:30.641486+00	\N	aal1	\N	2026-04-04 01:31:30.640179	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 OPR/129.0.0.0	187.7.162.44	\N	\N	\N	\N	\N
b909b9ef-05ec-4c92-9b1b-f922adbb0f96	6e34d11b-a290-417f-8b33-d8c0083bf0b0	2026-04-15 16:10:09.981682+00	2026-04-15 16:10:09.981682+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36	179.130.52.196	\N	\N	\N	\N	\N
a4aad5d1-6f15-4414-aebb-3496e92985a1	6e34d11b-a290-417f-8b33-d8c0083bf0b0	2026-04-15 16:17:45.906444+00	2026-04-15 16:17:45.906444+00	\N	aal1	\N	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36 OPR/97.0.0.0	179.130.52.196	\N	\N	\N	\N	\N
b0165391-528d-4d98-a34e-49f793f92703	6e34d11b-a290-417f-8b33-d8c0083bf0b0	2026-04-16 20:09:10.952301+00	2026-04-16 22:10:04.099263+00	\N	aal1	\N	2026-04-16 22:10:04.099136	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 OPR/129.0.0.0	187.7.162.44	\N	\N	\N	\N	\N
\.


--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sso_domains (id, sso_provider_id, domain, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sso_providers (id, resource_id, created_at, updated_at, disabled) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at, is_anonymous) FROM stdin;
00000000-0000-0000-0000-000000000000	8664839b-c487-40b6-ac2d-31defc586c27	authenticated	authenticated	dixx.gnomio@gmail.com	$2a$10$xeUZBNdUlKRnMD5v0aDrvemIcbkQk29h2H3PVuBv5VItsuH9YabCW	2026-03-08 16:51:18.379975+00	\N		2026-03-08 16:50:53.114533+00		\N			\N	2026-03-08 16:52:04.266604+00	{"provider": "email", "providers": ["email"]}	{"sub": "8664839b-c487-40b6-ac2d-31defc586c27", "email": "dixx.gnomio@gmail.com", "company_name": "Borges_phones", "email_verified": true, "phone_verified": false}	\N	2026-03-08 16:50:52.99728+00	2026-03-08 16:52:04.270057+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	fbe71a65-4f7b-4519-8afd-5fb610daff7c	authenticated	authenticated	kmkz.clan+10@gmail.com	$2a$10$lSmhwvrEU48zEU58zko0LOnl6fc05OF0Njhyfw6P5VYzd492GZnsW	2026-02-20 01:20:10.738149+00	\N		2026-02-20 01:19:57.441432+00		\N			\N	2026-02-20 01:20:20.732608+00	{"provider": "email", "providers": ["email"]}	{"sub": "fbe71a65-4f7b-4519-8afd-5fb610daff7c", "email": "kmkz.clan+10@gmail.com", "company_name": "Minha Empresa", "email_verified": true, "phone_verified": false}	\N	2026-02-20 01:19:57.383562+00	2026-02-26 22:22:38.239491+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	6e34d11b-a290-417f-8b33-d8c0083bf0b0	authenticated	authenticated	kmkz.clan@gmail.com	$2a$10$3xvUq.ogQr2K6PFpNViBbOXO93tIkcpoIjF/x/a7NnN.kzetFZSc.	2026-02-08 03:22:34.221335+00	\N		2026-02-08 03:22:09.957046+00		\N			\N	2026-04-16 20:09:10.951488+00	{"provider": "email", "providers": ["email"]}	{"sub": "6e34d11b-a290-417f-8b33-d8c0083bf0b0", "email": "kmkz.clan@gmail.com", "company_name": "RNB Consultoria", "email_verified": true, "phone_verified": false}	\N	2026-02-08 03:22:09.889208+00	2026-04-16 22:10:04.08393+00	\N	\N			\N		0	\N		\N	f	\N	f
\.


--
-- Data for Name: webauthn_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.webauthn_challenges (id, user_id, challenge_type, session_data, created_at, expires_at) FROM stdin;
\.


--
-- Data for Name: webauthn_credentials; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.webauthn_credentials (id, user_id, credential_id, public_key, attestation_type, aaguid, sign_count, transports, backup_eligible, backed_up, friendly_name, created_at, updated_at, last_used_at) FROM stdin;
\.


--
-- Data for Name: job; Type: TABLE DATA; Schema: cron; Owner: supabase_admin
--

COPY cron.job (jobid, schedule, command, nodename, nodeport, database, username, active, jobname) FROM stdin;
1	0 3 * * *	CALL public.expire_subscriptions_and_log()	localhost	5432	postgres	postgres	t	daily_subscription_expiration_check
\.


--
-- Data for Name: job_run_details; Type: TABLE DATA; Schema: cron; Owner: supabase_admin
--

COPY cron.job_run_details (jobid, runid, job_pid, database, username, command, status, return_message, start_time, end_time) FROM stdin;
1	15	1161724	postgres	postgres	CALL public.expire_subscriptions_and_log()	failed	ERROR:  public.expire_subscriptions_and_log() is not a procedure\nLINE 1: CALL public.expire_subscriptions_and_log()\n             ^\nHINT:  To call a function, use SELECT.\n	2026-03-06 03:00:00.187265+00	2026-03-06 03:00:00.193361+00
1	1	545701	postgres	postgres	CALL public.expire_subscriptions_and_log()	failed	ERROR:  public.expire_subscriptions_and_log() is not a procedure\nLINE 1: CALL public.expire_subscriptions_and_log()\n             ^\nHINT:  To call a function, use SELECT.\n	2026-02-20 03:00:00.17717+00	2026-02-20 03:00:00.182991+00
1	10	943308	postgres	postgres	CALL public.expire_subscriptions_and_log()	failed	ERROR:  public.expire_subscriptions_and_log() is not a procedure\nLINE 1: CALL public.expire_subscriptions_and_log()\n             ^\nHINT:  To call a function, use SELECT.\n	2026-03-01 03:00:00.183332+00	2026-03-01 03:00:00.189976+00
1	22	1471744	postgres	postgres	CALL public.expire_subscriptions_and_log()	failed	ERROR:  public.expire_subscriptions_and_log() is not a procedure\nLINE 1: CALL public.expire_subscriptions_and_log()\n             ^\nHINT:  To call a function, use SELECT.\n	2026-03-13 03:00:00.200657+00	2026-03-13 03:00:00.208121+00
1	2	592767	postgres	postgres	CALL public.expire_subscriptions_and_log()	failed	ERROR:  public.expire_subscriptions_and_log() is not a procedure\nLINE 1: CALL public.expire_subscriptions_and_log()\n             ^\nHINT:  To call a function, use SELECT.\n	2026-02-21 03:00:00.18169+00	2026-02-21 03:00:00.188717+00
1	16	1205704	postgres	postgres	CALL public.expire_subscriptions_and_log()	failed	ERROR:  public.expire_subscriptions_and_log() is not a procedure\nLINE 1: CALL public.expire_subscriptions_and_log()\n             ^\nHINT:  To call a function, use SELECT.\n	2026-03-07 03:00:00.210389+00	2026-03-07 03:00:00.21793+00
1	11	986726	postgres	postgres	CALL public.expire_subscriptions_and_log()	failed	ERROR:  public.expire_subscriptions_and_log() is not a procedure\nLINE 1: CALL public.expire_subscriptions_and_log()\n             ^\nHINT:  To call a function, use SELECT.\n	2026-03-02 03:00:00.202908+00	2026-03-02 03:00:00.20959+00
1	3	636143	postgres	postgres	CALL public.expire_subscriptions_and_log()	failed	ERROR:  public.expire_subscriptions_and_log() is not a procedure\nLINE 1: CALL public.expire_subscriptions_and_log()\n             ^\nHINT:  To call a function, use SELECT.\n	2026-02-22 03:00:00.186949+00	2026-02-22 03:00:00.192843+00
1	19	1336449	postgres	postgres	CALL public.expire_subscriptions_and_log()	failed	ERROR:  public.expire_subscriptions_and_log() is not a procedure\nLINE 1: CALL public.expire_subscriptions_and_log()\n             ^\nHINT:  To call a function, use SELECT.\n	2026-03-10 03:00:00.172852+00	2026-03-10 03:00:00.179247+00
1	4	679883	postgres	postgres	CALL public.expire_subscriptions_and_log()	failed	ERROR:  public.expire_subscriptions_and_log() is not a procedure\nLINE 1: CALL public.expire_subscriptions_and_log()\n             ^\nHINT:  To call a function, use SELECT.\n	2026-02-23 03:00:00.167147+00	2026-02-23 03:00:00.173883+00
1	12	1030336	postgres	postgres	CALL public.expire_subscriptions_and_log()	failed	ERROR:  public.expire_subscriptions_and_log() is not a procedure\nLINE 1: CALL public.expire_subscriptions_and_log()\n             ^\nHINT:  To call a function, use SELECT.\n	2026-03-03 03:00:00.192573+00	2026-03-03 03:00:00.199255+00
1	5	723494	postgres	postgres	CALL public.expire_subscriptions_and_log()	failed	ERROR:  public.expire_subscriptions_and_log() is not a procedure\nLINE 1: CALL public.expire_subscriptions_and_log()\n             ^\nHINT:  To call a function, use SELECT.\n	2026-02-24 03:00:00.153129+00	2026-02-24 03:00:00.160999+00
1	21	1426445	postgres	postgres	CALL public.expire_subscriptions_and_log()	failed	ERROR:  public.expire_subscriptions_and_log() is not a procedure\nLINE 1: CALL public.expire_subscriptions_and_log()\n             ^\nHINT:  To call a function, use SELECT.\n	2026-03-12 03:00:00.189425+00	2026-03-12 03:00:00.196891+00
1	17	1249050	postgres	postgres	CALL public.expire_subscriptions_and_log()	failed	ERROR:  public.expire_subscriptions_and_log() is not a procedure\nLINE 1: CALL public.expire_subscriptions_and_log()\n             ^\nHINT:  To call a function, use SELECT.\n	2026-03-08 03:00:00.192075+00	2026-03-08 03:00:00.198223+00
1	6	767493	postgres	postgres	CALL public.expire_subscriptions_and_log()	failed	ERROR:  public.expire_subscriptions_and_log() is not a procedure\nLINE 1: CALL public.expire_subscriptions_and_log()\n             ^\nHINT:  To call a function, use SELECT.\n	2026-02-25 03:00:00.186208+00	2026-02-25 03:00:00.193+00
1	13	1074181	postgres	postgres	CALL public.expire_subscriptions_and_log()	failed	ERROR:  public.expire_subscriptions_and_log() is not a procedure\nLINE 1: CALL public.expire_subscriptions_and_log()\n             ^\nHINT:  To call a function, use SELECT.\n	2026-03-04 03:00:00.198146+00	2026-03-04 03:00:00.205982+00
1	7	811547	postgres	postgres	CALL public.expire_subscriptions_and_log()	failed	ERROR:  public.expire_subscriptions_and_log() is not a procedure\nLINE 1: CALL public.expire_subscriptions_and_log()\n             ^\nHINT:  To call a function, use SELECT.\n	2026-02-26 03:00:00.193942+00	2026-02-26 03:00:00.200883+00
1	24	1562903	postgres	postgres	CALL public.expire_subscriptions_and_log()	failed	ERROR:  public.expire_subscriptions_and_log() is not a procedure\nLINE 1: CALL public.expire_subscriptions_and_log()\n             ^\nHINT:  To call a function, use SELECT.\n	2026-03-15 03:00:00.192528+00	2026-03-15 03:00:00.19961+00
1	20	1381291	postgres	postgres	CALL public.expire_subscriptions_and_log()	failed	ERROR:  public.expire_subscriptions_and_log() is not a procedure\nLINE 1: CALL public.expire_subscriptions_and_log()\n             ^\nHINT:  To call a function, use SELECT.\n	2026-03-11 03:00:00.189671+00	2026-03-11 03:00:00.196011+00
1	14	1118131	postgres	postgres	CALL public.expire_subscriptions_and_log()	failed	ERROR:  public.expire_subscriptions_and_log() is not a procedure\nLINE 1: CALL public.expire_subscriptions_and_log()\n             ^\nHINT:  To call a function, use SELECT.\n	2026-03-05 03:00:00.183902+00	2026-03-05 03:00:00.185594+00
1	8	855337	postgres	postgres	CALL public.expire_subscriptions_and_log()	failed	ERROR:  public.expire_subscriptions_and_log() is not a procedure\nLINE 1: CALL public.expire_subscriptions_and_log()\n             ^\nHINT:  To call a function, use SELECT.\n	2026-02-27 03:00:00.191582+00	2026-02-27 03:00:00.198364+00
1	18	1292913	postgres	postgres	CALL public.expire_subscriptions_and_log()	failed	ERROR:  public.expire_subscriptions_and_log() is not a procedure\nLINE 1: CALL public.expire_subscriptions_and_log()\n             ^\nHINT:  To call a function, use SELECT.\n	2026-03-09 03:00:00.158369+00	2026-03-09 03:00:00.165976+00
1	9	899307	postgres	postgres	CALL public.expire_subscriptions_and_log()	failed	ERROR:  public.expire_subscriptions_and_log() is not a procedure\nLINE 1: CALL public.expire_subscriptions_and_log()\n             ^\nHINT:  To call a function, use SELECT.\n	2026-02-28 03:00:00.198234+00	2026-02-28 03:00:00.204788+00
1	23	1517948	postgres	postgres	CALL public.expire_subscriptions_and_log()	failed	ERROR:  public.expire_subscriptions_and_log() is not a procedure\nLINE 1: CALL public.expire_subscriptions_and_log()\n             ^\nHINT:  To call a function, use SELECT.\n	2026-03-14 03:00:00.201465+00	2026-03-14 03:00:00.208218+00
1	25	1611048	postgres	postgres	CALL public.expire_subscriptions_and_log()	failed	ERROR:  public.expire_subscriptions_and_log() is not a procedure\nLINE 1: CALL public.expire_subscriptions_and_log()\n             ^\nHINT:  To call a function, use SELECT.\n	2026-03-16 03:00:00.182445+00	2026-03-16 03:00:00.189055+00
1	40	489491	postgres	postgres	CALL public.expire_subscriptions_and_log()	failed	ERROR:  public.expire_subscriptions_and_log() is not a procedure\nLINE 1: CALL public.expire_subscriptions_and_log()\n             ^\nHINT:  To call a function, use SELECT.\n	2026-04-09 03:00:00.183873+00	2026-04-09 03:00:00.191369+00
1	26	1655810	postgres	postgres	CALL public.expire_subscriptions_and_log()	failed	ERROR:  public.expire_subscriptions_and_log() is not a procedure\nLINE 1: CALL public.expire_subscriptions_and_log()\n             ^\nHINT:  To call a function, use SELECT.\n	2026-03-17 03:00:00.172152+00	2026-03-17 03:00:00.179277+00
1	35	271002	postgres	postgres	CALL public.expire_subscriptions_and_log()	failed	ERROR:  public.expire_subscriptions_and_log() is not a procedure\nLINE 1: CALL public.expire_subscriptions_and_log()\n             ^\nHINT:  To call a function, use SELECT.\n	2026-04-04 03:00:00.166511+00	2026-04-04 03:00:00.173693+00
1	27	1703246	postgres	postgres	CALL public.expire_subscriptions_and_log()	failed	ERROR:  public.expire_subscriptions_and_log() is not a procedure\nLINE 1: CALL public.expire_subscriptions_and_log()\n             ^\nHINT:  To call a function, use SELECT.\n	2026-03-18 03:00:00.178058+00	2026-03-18 03:00:00.18385+00
1	41	532900	postgres	postgres	CALL public.expire_subscriptions_and_log()	failed	ERROR:  public.expire_subscriptions_and_log() is not a procedure\nLINE 1: CALL public.expire_subscriptions_and_log()\n             ^\nHINT:  To call a function, use SELECT.\n	2026-04-10 03:00:00.161431+00	2026-04-10 03:00:00.170447+00
1	36	316970	postgres	postgres	CALL public.expire_subscriptions_and_log()	failed	ERROR:  public.expire_subscriptions_and_log() is not a procedure\nLINE 1: CALL public.expire_subscriptions_and_log()\n             ^\nHINT:  To call a function, use SELECT.\n	2026-04-05 03:00:00.176662+00	2026-04-05 03:00:00.179658+00
1	28	1753050	postgres	postgres	CALL public.expire_subscriptions_and_log()	failed	ERROR:  public.expire_subscriptions_and_log() is not a procedure\nLINE 1: CALL public.expire_subscriptions_and_log()\n             ^\nHINT:  To call a function, use SELECT.\n	2026-03-19 03:00:00.17933+00	2026-03-19 03:00:00.186888+00
1	44	662460	postgres	postgres	CALL public.expire_subscriptions_and_log()	failed	ERROR:  public.expire_subscriptions_and_log() is not a procedure\nLINE 1: CALL public.expire_subscriptions_and_log()\n             ^\nHINT:  To call a function, use SELECT.\n	2026-04-13 03:00:00.185851+00	2026-04-13 03:00:00.194948+00
1	29	1802044	postgres	postgres	CALL public.expire_subscriptions_and_log()	failed	ERROR:  public.expire_subscriptions_and_log() is not a procedure\nLINE 1: CALL public.expire_subscriptions_and_log()\n             ^\nHINT:  To call a function, use SELECT.\n	2026-03-20 03:00:00.176639+00	2026-03-20 03:00:00.184423+00
1	37	360022	postgres	postgres	CALL public.expire_subscriptions_and_log()	failed	ERROR:  public.expire_subscriptions_and_log() is not a procedure\nLINE 1: CALL public.expire_subscriptions_and_log()\n             ^\nHINT:  To call a function, use SELECT.\n	2026-04-06 03:00:00.154293+00	2026-04-06 03:00:00.160704+00
1	30	46550	postgres	postgres	CALL public.expire_subscriptions_and_log()	failed	ERROR:  public.expire_subscriptions_and_log() is not a procedure\nLINE 1: CALL public.expire_subscriptions_and_log()\n             ^\nHINT:  To call a function, use SELECT.\n	2026-03-30 03:00:00.184611+00	2026-03-30 03:00:00.192739+00
1	42	576310	postgres	postgres	CALL public.expire_subscriptions_and_log()	failed	ERROR:  public.expire_subscriptions_and_log() is not a procedure\nLINE 1: CALL public.expire_subscriptions_and_log()\n             ^\nHINT:  To call a function, use SELECT.\n	2026-04-11 03:00:00.164374+00	2026-04-11 03:00:00.172423+00
1	31	98216	postgres	postgres	CALL public.expire_subscriptions_and_log()	failed	ERROR:  public.expire_subscriptions_and_log() is not a procedure\nLINE 1: CALL public.expire_subscriptions_and_log()\n             ^\nHINT:  To call a function, use SELECT.\n	2026-03-31 03:00:00.174846+00	2026-03-31 03:00:00.180322+00
1	38	403487	postgres	postgres	CALL public.expire_subscriptions_and_log()	failed	ERROR:  public.expire_subscriptions_and_log() is not a procedure\nLINE 1: CALL public.expire_subscriptions_and_log()\n             ^\nHINT:  To call a function, use SELECT.\n	2026-04-07 03:00:00.190954+00	2026-04-07 03:00:00.197284+00
1	32	141318	postgres	postgres	CALL public.expire_subscriptions_and_log()	failed	ERROR:  public.expire_subscriptions_and_log() is not a procedure\nLINE 1: CALL public.expire_subscriptions_and_log()\n             ^\nHINT:  To call a function, use SELECT.\n	2026-04-01 03:00:00.158304+00	2026-04-01 03:00:00.164361+00
1	45	24237	postgres	postgres	CALL public.expire_subscriptions_and_log()	failed	ERROR:  public.expire_subscriptions_and_log() is not a procedure\nLINE 1: CALL public.expire_subscriptions_and_log()\n             ^\nHINT:  To call a function, use SELECT.\n	2026-04-16 03:00:00.164465+00	2026-04-16 03:00:00.171255+00
1	39	446231	postgres	postgres	CALL public.expire_subscriptions_and_log()	failed	ERROR:  public.expire_subscriptions_and_log() is not a procedure\nLINE 1: CALL public.expire_subscriptions_and_log()\n             ^\nHINT:  To call a function, use SELECT.\n	2026-04-08 03:00:00.15719+00	2026-04-08 03:00:00.164658+00
1	33	184430	postgres	postgres	CALL public.expire_subscriptions_and_log()	failed	ERROR:  public.expire_subscriptions_and_log() is not a procedure\nLINE 1: CALL public.expire_subscriptions_and_log()\n             ^\nHINT:  To call a function, use SELECT.\n	2026-04-02 03:00:00.178909+00	2026-04-02 03:00:00.187353+00
1	43	619214	postgres	postgres	CALL public.expire_subscriptions_and_log()	failed	ERROR:  public.expire_subscriptions_and_log() is not a procedure\nLINE 1: CALL public.expire_subscriptions_and_log()\n             ^\nHINT:  To call a function, use SELECT.\n	2026-04-12 03:00:00.182086+00	2026-04-12 03:00:00.185778+00
1	34	227759	postgres	postgres	CALL public.expire_subscriptions_and_log()	failed	ERROR:  public.expire_subscriptions_and_log() is not a procedure\nLINE 1: CALL public.expire_subscriptions_and_log()\n             ^\nHINT:  To call a function, use SELECT.\n	2026-04-03 03:00:00.166361+00	2026-04-03 03:00:00.173091+00
\.


--
-- Data for Name: clients; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.clients (id, user_id, name, email, phone, address, created_at, document, avatar) FROM stdin;
06092061-e5b9-4728-85c8-58bad4da5ab9	6e34d11b-a290-417f-8b33-d8c0083bf0b0	Antonio das Candongas	antonio.candon@gmail.com	21988542132	Barata Ribeiro 160 - Copacabana - RJ	2026-02-13 15:06:46.453813+00	00000000000	\N
2b47309f-c67d-4a31-ad37-d730b1e59314	6e34d11b-a290-417f-8b33-d8c0083bf0b0	Cliente				2026-03-03 19:04:30.015359+00		\N
\.


--
-- Data for Name: contracts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contracts (id, quote_id, content, status, client_signature, signed_at, created_at) FROM stdin;
\.


--
-- Data for Name: feedbacks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.feedbacks (id, user_id, email, nps, general, improvements, ratings, comments, created_at) FROM stdin;
b2392d9b-785f-4acf-b03f-f98f14b03386	6e34d11b-a290-417f-8b33-d8c0083bf0b0	kmkz.clan@gmail.com	7			{"design": 3, "support": 3, "features": 3, "usability": 3, "performance": 3}	{"design": "", "support": "", "features": "", "usability": "", "performance": ""}	2026-03-13 13:55:49.420584+00
\.


--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.profiles (id, company_name, logo_url, plan_type, whatsapp, created_at, logo, document, phone, address, tech_signature, material_catalog, contract_templates, email, name, subscription_status, trial_ends_at, pix_key, bank_info, subscription_ends_at, updated_at, subscription_plan, subscription_activated_at) FROM stdin;
8664839b-c487-40b6-ac2d-31defc586c27	Borges_phones	\N	STARTER	\N	2026-03-08 16:50:52.995585+00	\N	\N	\N	\N	\N	[]	[]	dixx.gnomio@gmail.com	Gestor	trial	2026-04-07 16:50:52.995585+00	\N	\N	\N	2026-03-08 16:50:52.995585+00	\N	\N
fbe71a65-4f7b-4519-8afd-5fb610daff7c	Minha Empresa	\N	STARTER	\N	2026-02-20 01:19:57.381258+00	\N	\N	\N	\N	\N	[]	[]	kmkz.clan+10@gmail.com	Gestor	trial	2026-03-22 01:19:57.381258+00	\N	\N	\N	2026-02-20 01:19:57.381258+00	\N	\N
6e34d11b-a290-417f-8b33-d8c0083bf0b0	RNB Consultoria	\N	STARTER	\N	2026-02-08 03:22:09.888852+00	data:image/png;base64,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	33032127000141	41988069976	Lilian Viana de Araujo 464	data:image/png;base64,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	[{"id": "1cd4297c-e7ec-4268-96eb-4804bb5d08ba", "name": "Termostato ", "brand": "Genérica", "quantity": 1, "unitPrice": 15, "totalPrice": 15}]	[]	kmkz.clan@gmail.com	Rafael Budelmann	active	2027-02-18 20:15:39.472+00	41988069976	\N	2026-04-09 03:54:27.848946+00	2026-04-16 22:38:45.382+00	\N	\N
\.


--
-- Data for Name: quotes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.quotes (id, user_id, client_id, number, status, services, materials, total_value, public_token, viewed_at, created_at, company_info, date, valid_until, warranty_duration, payment_terms, completion_date, warranty_until, signature_data, contract_number, access_password) FROM stdin;
\.


--
-- Data for Name: subscription_audit_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.subscription_audit_logs (id, user_id, event, plan, details, created_at) FROM stdin;
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.schema_migrations (version, inserted_at) FROM stdin;
20211116024918	2026-02-08 03:37:21
20211116045059	2026-02-08 03:37:23
20211116050929	2026-02-08 03:37:24
20211116051442	2026-02-08 03:37:25
20211116212300	2026-02-08 03:37:27
20211116213355	2026-02-08 03:37:28
20211116213934	2026-02-08 03:37:29
20211116214523	2026-02-08 03:37:31
20211122062447	2026-02-08 03:37:32
20211124070109	2026-02-08 03:37:33
20211202204204	2026-02-08 03:37:34
20211202204605	2026-02-08 03:37:35
20211210212804	2026-02-08 03:37:39
20211228014915	2026-02-08 03:37:41
20220107221237	2026-02-08 03:37:42
20220228202821	2026-02-08 03:37:43
20220312004840	2026-02-08 03:37:44
20220603231003	2026-02-08 03:37:46
20220603232444	2026-02-08 03:37:47
20220615214548	2026-02-08 03:37:49
20220712093339	2026-02-08 03:37:50
20220908172859	2026-02-08 03:37:51
20220916233421	2026-02-08 03:37:52
20230119133233	2026-02-08 03:37:53
20230128025114	2026-02-08 03:37:55
20230128025212	2026-02-08 03:37:56
20230227211149	2026-02-08 03:37:57
20230228184745	2026-02-08 03:37:58
20230308225145	2026-02-08 03:38:00
20230328144023	2026-02-08 03:38:01
20231018144023	2026-02-08 03:38:02
20231204144023	2026-02-08 03:38:04
20231204144024	2026-02-08 03:38:05
20231204144025	2026-02-08 03:38:06
20240108234812	2026-02-08 03:38:07
20240109165339	2026-02-08 03:38:09
20240227174441	2026-02-08 03:38:11
20240311171622	2026-02-08 03:38:12
20240321100241	2026-02-08 03:38:15
20240401105812	2026-02-08 03:38:18
20240418121054	2026-02-08 03:38:20
20240523004032	2026-02-08 03:38:24
20240618124746	2026-02-08 03:38:25
20240801235015	2026-02-08 03:38:26
20240805133720	2026-02-08 03:38:27
20240827160934	2026-02-08 03:38:29
20240919163303	2026-02-08 03:38:30
20240919163305	2026-02-08 03:38:31
20241019105805	2026-02-08 03:38:33
20241030150047	2026-02-08 03:38:37
20241108114728	2026-02-08 03:38:39
20241121104152	2026-02-08 03:38:40
20241130184212	2026-02-08 03:38:41
20241220035512	2026-02-08 03:38:42
20241220123912	2026-02-08 03:38:43
20241224161212	2026-02-08 03:38:45
20250107150512	2026-02-08 03:38:46
20250110162412	2026-02-08 03:38:47
20250123174212	2026-02-08 03:38:48
20250128220012	2026-02-08 03:38:49
20250506224012	2026-02-08 03:38:50
20250523164012	2026-02-08 03:38:51
20250714121412	2026-02-08 03:38:53
20250905041441	2026-02-08 03:38:54
20251103001201	2026-02-08 03:38:55
20251120212548	2026-02-08 03:38:57
20251120215549	2026-02-08 03:38:58
20260218120000	2026-03-08 22:57:50
20260326120000	2026-04-15 16:13:15
\.


--
-- Data for Name: subscription; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.subscription (id, subscription_id, entity, filters, claims, created_at, action_filter) FROM stdin;
\.


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.buckets (id, name, owner, created_at, updated_at, public, avif_autodetection, file_size_limit, allowed_mime_types, owner_id, type) FROM stdin;
client-avatars	client-avatars	\N	2026-02-12 00:54:14.786622+00	2026-02-12 00:54:14.786622+00	t	f	\N	\N	\N	STANDARD
labels	labels	\N	2026-02-24 16:54:02.404151+00	2026-02-24 16:54:02.404151+00	t	f	\N	\N	\N	STANDARD
\.


--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.buckets_analytics (name, type, format, created_at, updated_at, id, deleted_at) FROM stdin;
\.


--
-- Data for Name: buckets_vectors; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.buckets_vectors (id, type, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.migrations (id, name, hash, executed_at) FROM stdin;
0	create-migrations-table	e18db593bcde2aca2a408c4d1100f6abba2195df	2026-02-08 01:16:39.964439
1	initialmigration	6ab16121fbaa08bbd11b712d05f358f9b555d777	2026-02-08 01:16:40.038672
3	pathtoken-column	2cb1b0004b817b29d5b0a971af16bafeede4b70d	2026-02-08 01:16:40.103578
4	add-migrations-rls	427c5b63fe1c5937495d9c635c263ee7a5905058	2026-02-08 01:16:40.124533
5	add-size-functions	79e081a1455b63666c1294a440f8ad4b1e6a7f84	2026-02-08 01:16:40.130627
7	add-rls-to-buckets	e7e7f86adbc51049f341dfe8d30256c1abca17aa	2026-02-08 01:16:40.147845
8	add-public-to-buckets	fd670db39ed65f9d08b01db09d6202503ca2bab3	2026-02-08 01:16:40.155501
11	add-trigger-to-auto-update-updated_at-column	7425bdb14366d1739fa8a18c83100636d74dcaa2	2026-02-08 01:16:40.177325
12	add-automatic-avif-detection-flag	8e92e1266eb29518b6a4c5313ab8f29dd0d08df9	2026-02-08 01:16:40.183734
13	add-bucket-custom-limits	cce962054138135cd9a8c4bcd531598684b25e7d	2026-02-08 01:16:40.190319
14	use-bytes-for-max-size	941c41b346f9802b411f06f30e972ad4744dad27	2026-02-08 01:16:40.196423
15	add-can-insert-object-function	934146bc38ead475f4ef4b555c524ee5d66799e5	2026-02-08 01:16:40.233602
16	add-version	76debf38d3fd07dcfc747ca49096457d95b1221b	2026-02-08 01:16:40.241846
17	drop-owner-foreign-key	f1cbb288f1b7a4c1eb8c38504b80ae2a0153d101	2026-02-08 01:16:40.248068
18	add_owner_id_column_deprecate_owner	e7a511b379110b08e2f214be852c35414749fe66	2026-02-08 01:16:40.2544
19	alter-default-value-objects-id	02e5e22a78626187e00d173dc45f58fa66a4f043	2026-02-08 01:16:40.268456
20	list-objects-with-delimiter	cd694ae708e51ba82bf012bba00caf4f3b6393b7	2026-02-08 01:16:40.274711
21	s3-multipart-uploads	8c804d4a566c40cd1e4cc5b3725a664a9303657f	2026-02-08 01:16:40.283385
22	s3-multipart-uploads-big-ints	9737dc258d2397953c9953d9b86920b8be0cdb73	2026-02-08 01:16:40.297222
23	optimize-search-function	9d7e604cddc4b56a5422dc68c9313f4a1b6f132c	2026-02-08 01:16:40.309284
24	operation-function	8312e37c2bf9e76bbe841aa5fda889206d2bf8aa	2026-02-08 01:16:40.316652
25	custom-metadata	d974c6057c3db1c1f847afa0e291e6165693b990	2026-02-08 01:16:40.325286
37	add-bucket-name-length-trigger	3944135b4e3e8b22d6d4cbb568fe3b0b51df15c1	2026-02-08 01:16:41.259843
44	vector-bucket-type	99c20c0ffd52bb1ff1f32fb992f3b351e3ef8fb3	2026-02-08 01:16:41.315196
45	vector-buckets	049e27196d77a7cb76497a85afae669d8b230953	2026-02-08 01:16:41.32284
46	buckets-objects-grants	fedeb96d60fefd8e02ab3ded9fbde05632f84aed	2026-02-08 01:16:41.334796
47	iceberg-table-metadata	649df56855c24d8b36dd4cc1aeb8251aa9ad42c2	2026-02-08 01:16:41.341014
49	buckets-objects-grants-postgres	072b1195d0d5a2f888af6b2302a1938dd94b8b3d	2026-02-08 01:16:41.36384
2	storage-schema	f6a1fa2c93cbcd16d4e487b362e45fca157a8dbd	2026-02-08 01:16:40.044835
6	change-column-name-in-get-size	ded78e2f1b5d7e616117897e6443a925965b30d2	2026-02-08 01:16:40.138752
9	fix-search-function	af597a1b590c70519b464a4ab3be54490712796b	2026-02-08 01:16:40.161972
10	search-files-search-function	b595f05e92f7e91211af1bbfe9c6a13bb3391e16	2026-02-08 01:16:40.168288
26	objects-prefixes	215cabcb7f78121892a5a2037a09fedf9a1ae322	2026-02-08 01:16:40.332523
27	search-v2	859ba38092ac96eb3964d83bf53ccc0b141663a6	2026-02-08 01:16:40.348193
28	object-bucket-name-sorting	c73a2b5b5d4041e39705814fd3a1b95502d38ce4	2026-02-08 01:16:41.198427
29	create-prefixes	ad2c1207f76703d11a9f9007f821620017a66c21	2026-02-08 01:16:41.206005
30	update-object-levels	2be814ff05c8252fdfdc7cfb4b7f5c7e17f0bed6	2026-02-08 01:16:41.21184
31	objects-level-index	b40367c14c3440ec75f19bbce2d71e914ddd3da0	2026-02-08 01:16:41.219766
32	backward-compatible-index-on-objects	e0c37182b0f7aee3efd823298fb3c76f1042c0f7	2026-02-08 01:16:41.227807
33	backward-compatible-index-on-prefixes	b480e99ed951e0900f033ec4eb34b5bdcb4e3d49	2026-02-08 01:16:41.235571
34	optimize-search-function-v1	ca80a3dc7bfef894df17108785ce29a7fc8ee456	2026-02-08 01:16:41.237806
35	add-insert-trigger-prefixes	458fe0ffd07ec53f5e3ce9df51bfdf4861929ccc	2026-02-08 01:16:41.24549
36	optimise-existing-functions	6ae5fca6af5c55abe95369cd4f93985d1814ca8f	2026-02-08 01:16:41.251258
38	iceberg-catalog-flag-on-buckets	02716b81ceec9705aed84aa1501657095b32e5c5	2026-02-08 01:16:41.266369
39	add-search-v2-sort-support	6706c5f2928846abee18461279799ad12b279b78	2026-02-08 01:16:41.275811
40	fix-prefix-race-conditions-optimized	7ad69982ae2d372b21f48fc4829ae9752c518f6b	2026-02-08 01:16:41.282304
41	add-object-level-update-trigger	07fcf1a22165849b7a029deed059ffcde08d1ae0	2026-02-08 01:16:41.292162
42	rollback-prefix-triggers	771479077764adc09e2ea2043eb627503c034cd4	2026-02-08 01:16:41.298723
43	fix-object-level	84b35d6caca9d937478ad8a797491f38b8c2979f	2026-02-08 01:16:41.308907
48	iceberg-catalog-ids	e0e8b460c609b9999ccd0df9ad14294613eed939	2026-02-08 01:16:41.347611
50	search-v2-optimised	6323ac4f850aa14e7387eb32102869578b5bd478	2026-02-10 22:00:19.730695
51	index-backward-compatible-search	2ee395d433f76e38bcd3856debaf6e0e5b674011	2026-02-10 22:00:19.776824
52	drop-not-used-indexes-and-functions	5cc44c8696749ac11dd0dc37f2a3802075f3a171	2026-02-10 22:00:19.778381
53	drop-index-lower-name	d0cb18777d9e2a98ebe0bc5cc7a42e57ebe41854	2026-02-10 22:00:19.806883
54	drop-index-object-level	6289e048b1472da17c31a7eba1ded625a6457e67	2026-02-10 22:00:19.809014
55	prevent-direct-deletes	262a4798d5e0f2e7c8970232e03ce8be695d5819	2026-02-10 22:00:19.81049
56	fix-optimized-search-function	cb58526ebc23048049fd5bf2fd148d18b04a2073	2026-02-10 22:00:19.815805
57	s3-multipart-uploads-metadata	f127886e00d1b374fadbc7c6b31e09336aad5287	2026-04-15 16:10:16.520684
58	operation-ergonomics	00ca5d483b3fe0d522133d9002ccc5df98365120	2026-04-15 16:10:16.53788
\.


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.objects (id, bucket_id, name, owner, created_at, updated_at, last_accessed_at, metadata, version, owner_id, user_metadata) FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.s3_multipart_uploads (id, in_progress_size, upload_signature, bucket_id, key, version, owner_id, created_at, user_metadata, metadata) FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.s3_multipart_uploads_parts (id, upload_id, size, part_number, bucket_id, key, etag, owner_id, version, created_at) FROM stdin;
\.


--
-- Data for Name: vector_indexes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.vector_indexes (id, name, bucket_id, data_type, dimension, distance_metric, metadata_configuration, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: supabase_migrations; Owner: postgres
--

COPY supabase_migrations.schema_migrations (version, statements, name, created_by, idempotency_key, rollback) FROM stdin;
20260208030359	{"\n-- 1. PROFILES Table (Extends auth.users)\ncreate table if not exists public.profiles (\n  id uuid references auth.users not null primary key,\n  company_name text,\n  logo_url text, -- For storing supabase storage public url\n  plan_type text default 'STARTER' check (plan_type in ('STARTER', 'PRO')),\n  whatsapp text, -- For agent notifications\n  created_at timestamptz default now()\n);\n\nalter table public.profiles enable row level security;\n\n-- Policy: Users can view/edit their own profile\ncreate policy \\"Users can view own profile\\" on public.profiles for select using (auth.uid() = id);\ncreate policy \\"Users can update own profile\\" on public.profiles for update using (auth.uid() = id);\n\n-- 2. CLIENTS Table\ncreate table if not exists public.clients (\n  id uuid default gen_random_uuid() primary key,\n  user_id uuid references auth.users not null, -- The professional who owns this client\n  name text not null,\n  email text,\n  phone text, -- Essential for WhatsApp\n  address text,\n  created_at timestamptz default now()\n);\n\nalter table public.clients enable row level security;\n\n-- Policy: Professionals can only see THEIR clients\ncreate policy \\"Users can view own clients\\" on public.clients for select using (auth.uid() = user_id);\ncreate policy \\"Users can insert own clients\\" on public.clients for insert with check (auth.uid() = user_id);\ncreate policy \\"Users can update own clients\\" on public.clients for update using (auth.uid() = user_id);\ncreate policy \\"Users can delete own clients\\" on public.clients for delete using (auth.uid() = user_id);\n\n\n-- 3. QUOTES Table (Orçamentos)\ncreate table if not exists public.quotes (\n  id uuid default gen_random_uuid() primary key,\n  user_id uuid references auth.users not null, -- Owner\n  client_id uuid references public.clients,\n  number text not null, -- e.g. #001\n  status text default 'DRAFT' check (status in ('DRAFT', 'SENT', 'VIEWED', 'APPROVED', 'REJECTED', 'COMPLETED')),\n  \n  -- Core Data (storing complex items as JSONB for flexibility)\n  services jsonb default '[]'::jsonb, \n  materials jsonb default '[]'::jsonb,\n  total_value numeric(10,2) default 0,\n  \n  -- Public Access Logic\n  public_token uuid default gen_random_uuid(), -- The \\"secret\\" link token\n  viewed_at timestamptz, -- Tracks when client opened the link\n  \n  created_at timestamptz default now()\n);\n\nalter table public.quotes enable row level security;\n\n-- Policy: Only owner can manage quotes\ncreate policy \\"Users can manage own quotes\\" on public.quotes for all using (auth.uid() = user_id);\n\n-- Policy: PUBLIC Access via Token (Visualização do Cliente)\n-- Allows checking a quote if the public_token matches (without login)\ncreate policy \\"Public view with token\\" on public.quotes for select using (true); \n-- Ideally this should be tighter, but for Select with explicit ID/Token query it's acceptable for this MVP phase.\n\n\n-- 4. CONTRACTS Table\ncreate table if not exists public.contracts (\n  id uuid default gen_random_uuid() primary key,\n  quote_id uuid references public.quotes not null unique, -- 1-to-1 relationship\n  content text, -- The AI generated text\n  status text default 'DRAFT' check (status in ('DRAFT', 'SENT', 'VIEWED', 'SIGNED', 'REJECTED')),\n  \n  -- Signature Data\n  client_signature text, -- Base64 or URL\n  signed_at timestamptz,\n  \n  created_at timestamptz default now()\n);\n\nalter table public.contracts enable row level security;\n\n-- Policy: Owner access\ncreate policy \\"Users can manage contracts via quotes\\" on public.contracts for all using (\n  exists (select 1 from public.quotes where quotes.id = contracts.quote_id and quotes.user_id = auth.uid())\n);\n\n-- Policy: Public access (simpler for now, refine later for security)\ncreate policy \\"Public view contract\\" on public.contracts for select using (true);\n\n\n-- 5. TRIGGER: Create Profile on Signup\n-- Automatically creates a profile entry when a new user signs up via Supabase Auth\ncreate or replace function public.handle_new_user() \nreturns trigger as $$\nbegin\n  insert into public.profiles (id, company_name, plan_type)\n  values (new.id, new.raw_user_meta_data->>'company_name', 'STARTER');\n  return new;\nend;\n$$ language plpgsql security definer;\n\ncreate trigger on_auth_user_created\n  after insert on auth.users\n  for each row execute procedure public.handle_new_user();\n\n"}	initial_schema	ronick_nick@hotmail.com	\N	\N
20260224165402	{"-- Create label_scans table\ncreate table if not exists label_scans (\n  id uuid primary key default gen_random_uuid(),\n  image_url text not null,\n  extracted_data jsonb,\n  status text not null default 'pending', -- pending, processing, completed, error\n  created_at timestamp with time zone default now()\n);\n\n-- Enable RLS\nalter table label_scans enable row level security;\n\n-- Drop existing policy if it exists to avoid errors on reapplying\ndo $$ \nbegin\n    if exists (select 1 from pg_policies where policyname = 'Allow public access' and tablename = 'label_scans') then\n        drop policy \\"Allow public access\\" on label_scans;\n    end if;\nend $$;\n\n-- Create policy for public access (Simplified for development)\ncreate policy \\"Allow public access\\" \non label_scans \nfor all \nusing (true) \nwith check (true);\n\n-- Storage bucket for labels\ninsert into storage.buckets (id, name, public) \nvalues ('labels', 'labels', true)\non conflict (id) do nothing;\n\n-- Storage policies\ncreate policy \\"Public Access Labels\\" \non storage.objects for select \nusing ( bucket_id = 'labels' );\n\ncreate policy \\"Upload Labels\\" \non storage.objects for insert \nwith check ( bucket_id = 'labels' );\n"}	setup_label_scanner	ronick_nick@hotmail.com	\N	\N
20260312182853	{"\n-- Tabela para armazenar os feedbacks\nCREATE TABLE IF NOT EXISTS public.feedbacks (\n    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,\n    user_id UUID REFERENCES auth.users(id),\n    email TEXT,\n    nps INTEGER,\n    general TEXT,\n    improvements TEXT,\n    ratings JSONB,\n    comments JSONB,\n    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL\n);\n\n-- Habilitar RLS\nALTER TABLE public.feedbacks ENABLE ROW LEVEL SECURITY;\n\n-- Políticas de Segurança\n-- Qualquer usuário autenticado pode inserir seu próprio feedback\nCREATE POLICY \\"Users can insert their own feedback\\" \nON public.feedbacks \nFOR INSERT \nWITH CHECK (auth.uid() = user_id OR user_id IS NULL);\n\n-- Apenas administradores (ou ninguém via app) podem ler feedbacks por enquanto\nCREATE POLICY \\"Users can view their own feedback\\" \nON public.feedbacks \nFOR SELECT \nUSING (auth.uid() = user_id);\n"}	create_feedbacks_table	ronick_nick@hotmail.com	\N	\N
20260313120027	{"-- Create feedbacks table\nCREATE TABLE IF NOT EXISTS feedbacks (\n  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,\n  user_id uuid REFERENCES auth.users ON DELETE SET NULL,\n  email text,\n  nps integer,\n  general text,\n  improvements text,\n  ratings jsonb,\n  comments jsonb,\n  created_at timestamptz DEFAULT now()\n);\n\n-- Enable RLS\nALTER TABLE feedbacks ENABLE ROW LEVEL SECURITY;\n\n-- Policies for feedbacks\nDROP POLICY IF EXISTS \\"Users can insert own feedback\\" ON feedbacks;\nCREATE POLICY \\"Users can insert own feedback\\" ON feedbacks \nFOR INSERT WITH CHECK (auth.uid() = user_id OR auth.uid() IS NULL);\n\nDROP POLICY IF EXISTS \\"Users can view own feedbacks\\" ON feedbacks;\nCREATE POLICY \\"Users can view own feedbacks\\" ON feedbacks \nFOR SELECT USING (auth.uid() = user_id);\n"}	create_feedbacks_table	ronick_nick@hotmail.com	\N	\N
\.


--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: supabase_admin
--

COPY vault.secrets (id, name, description, secret, key_id, nonce, created_at, updated_at) FROM stdin;
\.


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('auth.refresh_tokens_id_seq', 130, true);


--
-- Name: jobid_seq; Type: SEQUENCE SET; Schema: cron; Owner: supabase_admin
--

SELECT pg_catalog.setval('cron.jobid_seq', 1, true);


--
-- Name: runid_seq; Type: SEQUENCE SET; Schema: cron; Owner: supabase_admin
--

SELECT pg_catalog.setval('cron.runid_seq', 45, true);


--
-- Name: subscription_audit_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.subscription_audit_logs_id_seq', 1, false);


--
-- Name: subscription_id_seq; Type: SEQUENCE SET; Schema: realtime; Owner: supabase_admin
--

SELECT pg_catalog.setval('realtime.subscription_id_seq', 1, false);


--
-- Name: mfa_amr_claims amr_id_pk; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT amr_id_pk PRIMARY KEY (id);


--
-- Name: audit_log_entries audit_log_entries_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.audit_log_entries
    ADD CONSTRAINT audit_log_entries_pkey PRIMARY KEY (id);


--
-- Name: custom_oauth_providers custom_oauth_providers_identifier_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.custom_oauth_providers
    ADD CONSTRAINT custom_oauth_providers_identifier_key UNIQUE (identifier);


--
-- Name: custom_oauth_providers custom_oauth_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.custom_oauth_providers
    ADD CONSTRAINT custom_oauth_providers_pkey PRIMARY KEY (id);


--
-- Name: flow_state flow_state_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.flow_state
    ADD CONSTRAINT flow_state_pkey PRIMARY KEY (id);


--
-- Name: identities identities_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_pkey PRIMARY KEY (id);


--
-- Name: identities identities_provider_id_provider_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_provider_id_provider_unique UNIQUE (provider_id, provider);


--
-- Name: instances instances_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.instances
    ADD CONSTRAINT instances_pkey PRIMARY KEY (id);


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_authentication_method_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_authentication_method_pkey UNIQUE (session_id, authentication_method);


--
-- Name: mfa_challenges mfa_challenges_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_pkey PRIMARY KEY (id);


--
-- Name: mfa_factors mfa_factors_last_challenged_at_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_last_challenged_at_key UNIQUE (last_challenged_at);


--
-- Name: mfa_factors mfa_factors_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_pkey PRIMARY KEY (id);


--
-- Name: oauth_authorizations oauth_authorizations_authorization_code_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_authorization_code_key UNIQUE (authorization_code);


--
-- Name: oauth_authorizations oauth_authorizations_authorization_id_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_authorization_id_key UNIQUE (authorization_id);


--
-- Name: oauth_authorizations oauth_authorizations_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_pkey PRIMARY KEY (id);


--
-- Name: oauth_client_states oauth_client_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_client_states
    ADD CONSTRAINT oauth_client_states_pkey PRIMARY KEY (id);


--
-- Name: oauth_clients oauth_clients_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_clients
    ADD CONSTRAINT oauth_clients_pkey PRIMARY KEY (id);


--
-- Name: oauth_consents oauth_consents_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_pkey PRIMARY KEY (id);


--
-- Name: oauth_consents oauth_consents_user_client_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_user_client_unique UNIQUE (user_id, client_id);


--
-- Name: one_time_tokens one_time_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_token_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_token_unique UNIQUE (token);


--
-- Name: saml_providers saml_providers_entity_id_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_entity_id_key UNIQUE (entity_id);


--
-- Name: saml_providers saml_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_pkey PRIMARY KEY (id);


--
-- Name: saml_relay_states saml_relay_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: sso_domains sso_domains_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_pkey PRIMARY KEY (id);


--
-- Name: sso_providers sso_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_providers
    ADD CONSTRAINT sso_providers_pkey PRIMARY KEY (id);


--
-- Name: users users_phone_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_phone_key UNIQUE (phone);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: webauthn_challenges webauthn_challenges_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.webauthn_challenges
    ADD CONSTRAINT webauthn_challenges_pkey PRIMARY KEY (id);


--
-- Name: webauthn_credentials webauthn_credentials_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.webauthn_credentials
    ADD CONSTRAINT webauthn_credentials_pkey PRIMARY KEY (id);


--
-- Name: clients clients_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_pkey PRIMARY KEY (id);


--
-- Name: contracts contracts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contracts
    ADD CONSTRAINT contracts_pkey PRIMARY KEY (id);


--
-- Name: contracts contracts_quote_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contracts
    ADD CONSTRAINT contracts_quote_id_key UNIQUE (quote_id);


--
-- Name: feedbacks feedbacks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.feedbacks
    ADD CONSTRAINT feedbacks_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- Name: quotes quotes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quotes
    ADD CONSTRAINT quotes_pkey PRIMARY KEY (id);


--
-- Name: subscription_audit_logs subscription_audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscription_audit_logs
    ADD CONSTRAINT subscription_audit_logs_pkey PRIMARY KEY (id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE ONLY realtime.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: subscription pk_subscription; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.subscription
    ADD CONSTRAINT pk_subscription PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: buckets_analytics buckets_analytics_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets_analytics
    ADD CONSTRAINT buckets_analytics_pkey PRIMARY KEY (id);


--
-- Name: buckets buckets_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets
    ADD CONSTRAINT buckets_pkey PRIMARY KEY (id);


--
-- Name: buckets_vectors buckets_vectors_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets_vectors
    ADD CONSTRAINT buckets_vectors_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_name_key; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_name_key UNIQUE (name);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: objects objects_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT objects_pkey PRIMARY KEY (id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_pkey PRIMARY KEY (id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_pkey PRIMARY KEY (id);


--
-- Name: vector_indexes vector_indexes_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.vector_indexes
    ADD CONSTRAINT vector_indexes_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_idempotency_key_key; Type: CONSTRAINT; Schema: supabase_migrations; Owner: postgres
--

ALTER TABLE ONLY supabase_migrations.schema_migrations
    ADD CONSTRAINT schema_migrations_idempotency_key_key UNIQUE (idempotency_key);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: supabase_migrations; Owner: postgres
--

ALTER TABLE ONLY supabase_migrations.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: audit_logs_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX audit_logs_instance_id_idx ON auth.audit_log_entries USING btree (instance_id);


--
-- Name: confirmation_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX confirmation_token_idx ON auth.users USING btree (confirmation_token) WHERE ((confirmation_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: custom_oauth_providers_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX custom_oauth_providers_created_at_idx ON auth.custom_oauth_providers USING btree (created_at);


--
-- Name: custom_oauth_providers_enabled_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX custom_oauth_providers_enabled_idx ON auth.custom_oauth_providers USING btree (enabled);


--
-- Name: custom_oauth_providers_identifier_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX custom_oauth_providers_identifier_idx ON auth.custom_oauth_providers USING btree (identifier);


--
-- Name: custom_oauth_providers_provider_type_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX custom_oauth_providers_provider_type_idx ON auth.custom_oauth_providers USING btree (provider_type);


--
-- Name: email_change_token_current_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX email_change_token_current_idx ON auth.users USING btree (email_change_token_current) WHERE ((email_change_token_current)::text !~ '^[0-9 ]*$'::text);


--
-- Name: email_change_token_new_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX email_change_token_new_idx ON auth.users USING btree (email_change_token_new) WHERE ((email_change_token_new)::text !~ '^[0-9 ]*$'::text);


--
-- Name: factor_id_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX factor_id_created_at_idx ON auth.mfa_factors USING btree (user_id, created_at);


--
-- Name: flow_state_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX flow_state_created_at_idx ON auth.flow_state USING btree (created_at DESC);


--
-- Name: identities_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX identities_email_idx ON auth.identities USING btree (email text_pattern_ops);


--
-- Name: INDEX identities_email_idx; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON INDEX auth.identities_email_idx IS 'Auth: Ensures indexed queries on the email column';


--
-- Name: identities_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX identities_user_id_idx ON auth.identities USING btree (user_id);


--
-- Name: idx_auth_code; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_auth_code ON auth.flow_state USING btree (auth_code);


--
-- Name: idx_oauth_client_states_created_at; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_oauth_client_states_created_at ON auth.oauth_client_states USING btree (created_at);


--
-- Name: idx_user_id_auth_method; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_user_id_auth_method ON auth.flow_state USING btree (user_id, authentication_method);


--
-- Name: mfa_challenge_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX mfa_challenge_created_at_idx ON auth.mfa_challenges USING btree (created_at DESC);


--
-- Name: mfa_factors_user_friendly_name_unique; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX mfa_factors_user_friendly_name_unique ON auth.mfa_factors USING btree (friendly_name, user_id) WHERE (TRIM(BOTH FROM friendly_name) <> ''::text);


--
-- Name: mfa_factors_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX mfa_factors_user_id_idx ON auth.mfa_factors USING btree (user_id);


--
-- Name: oauth_auth_pending_exp_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_auth_pending_exp_idx ON auth.oauth_authorizations USING btree (expires_at) WHERE (status = 'pending'::auth.oauth_authorization_status);


--
-- Name: oauth_clients_deleted_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_clients_deleted_at_idx ON auth.oauth_clients USING btree (deleted_at);


--
-- Name: oauth_consents_active_client_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_consents_active_client_idx ON auth.oauth_consents USING btree (client_id) WHERE (revoked_at IS NULL);


--
-- Name: oauth_consents_active_user_client_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_consents_active_user_client_idx ON auth.oauth_consents USING btree (user_id, client_id) WHERE (revoked_at IS NULL);


--
-- Name: oauth_consents_user_order_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_consents_user_order_idx ON auth.oauth_consents USING btree (user_id, granted_at DESC);


--
-- Name: one_time_tokens_relates_to_hash_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX one_time_tokens_relates_to_hash_idx ON auth.one_time_tokens USING hash (relates_to);


--
-- Name: one_time_tokens_token_hash_hash_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX one_time_tokens_token_hash_hash_idx ON auth.one_time_tokens USING hash (token_hash);


--
-- Name: one_time_tokens_user_id_token_type_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX one_time_tokens_user_id_token_type_key ON auth.one_time_tokens USING btree (user_id, token_type);


--
-- Name: reauthentication_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX reauthentication_token_idx ON auth.users USING btree (reauthentication_token) WHERE ((reauthentication_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: recovery_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX recovery_token_idx ON auth.users USING btree (recovery_token) WHERE ((recovery_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: refresh_tokens_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_instance_id_idx ON auth.refresh_tokens USING btree (instance_id);


--
-- Name: refresh_tokens_instance_id_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_instance_id_user_id_idx ON auth.refresh_tokens USING btree (instance_id, user_id);


--
-- Name: refresh_tokens_parent_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_parent_idx ON auth.refresh_tokens USING btree (parent);


--
-- Name: refresh_tokens_session_id_revoked_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_session_id_revoked_idx ON auth.refresh_tokens USING btree (session_id, revoked);


--
-- Name: refresh_tokens_updated_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_updated_at_idx ON auth.refresh_tokens USING btree (updated_at DESC);


--
-- Name: saml_providers_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_providers_sso_provider_id_idx ON auth.saml_providers USING btree (sso_provider_id);


--
-- Name: saml_relay_states_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_created_at_idx ON auth.saml_relay_states USING btree (created_at DESC);


--
-- Name: saml_relay_states_for_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_for_email_idx ON auth.saml_relay_states USING btree (for_email);


--
-- Name: saml_relay_states_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_sso_provider_id_idx ON auth.saml_relay_states USING btree (sso_provider_id);


--
-- Name: sessions_not_after_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_not_after_idx ON auth.sessions USING btree (not_after DESC);


--
-- Name: sessions_oauth_client_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_oauth_client_id_idx ON auth.sessions USING btree (oauth_client_id);


--
-- Name: sessions_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_user_id_idx ON auth.sessions USING btree (user_id);


--
-- Name: sso_domains_domain_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX sso_domains_domain_idx ON auth.sso_domains USING btree (lower(domain));


--
-- Name: sso_domains_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sso_domains_sso_provider_id_idx ON auth.sso_domains USING btree (sso_provider_id);


--
-- Name: sso_providers_resource_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX sso_providers_resource_id_idx ON auth.sso_providers USING btree (lower(resource_id));


--
-- Name: sso_providers_resource_id_pattern_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sso_providers_resource_id_pattern_idx ON auth.sso_providers USING btree (resource_id text_pattern_ops);


--
-- Name: unique_phone_factor_per_user; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX unique_phone_factor_per_user ON auth.mfa_factors USING btree (user_id, phone);


--
-- Name: user_id_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX user_id_created_at_idx ON auth.sessions USING btree (user_id, created_at);


--
-- Name: users_email_partial_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX users_email_partial_key ON auth.users USING btree (email) WHERE (is_sso_user = false);


--
-- Name: INDEX users_email_partial_key; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON INDEX auth.users_email_partial_key IS 'Auth: A partial unique index that applies only when is_sso_user is false';


--
-- Name: users_instance_id_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_instance_id_email_idx ON auth.users USING btree (instance_id, lower((email)::text));


--
-- Name: users_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_instance_id_idx ON auth.users USING btree (instance_id);


--
-- Name: users_is_anonymous_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_is_anonymous_idx ON auth.users USING btree (is_anonymous);


--
-- Name: webauthn_challenges_expires_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX webauthn_challenges_expires_at_idx ON auth.webauthn_challenges USING btree (expires_at);


--
-- Name: webauthn_challenges_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX webauthn_challenges_user_id_idx ON auth.webauthn_challenges USING btree (user_id);


--
-- Name: webauthn_credentials_credential_id_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX webauthn_credentials_credential_id_key ON auth.webauthn_credentials USING btree (credential_id);


--
-- Name: webauthn_credentials_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX webauthn_credentials_user_id_idx ON auth.webauthn_credentials USING btree (user_id);


--
-- Name: clients_user_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX clients_user_id_idx ON public.clients USING btree (user_id);


--
-- Name: quotes_public_token_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX quotes_public_token_idx ON public.quotes USING btree (public_token);


--
-- Name: quotes_user_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX quotes_user_id_idx ON public.quotes USING btree (user_id);


--
-- Name: ix_realtime_subscription_entity; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX ix_realtime_subscription_entity ON realtime.subscription USING btree (entity);


--
-- Name: messages_inserted_at_topic_index; Type: INDEX; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE INDEX messages_inserted_at_topic_index ON ONLY realtime.messages USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: subscription_subscription_id_entity_filters_action_filter_key; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE UNIQUE INDEX subscription_subscription_id_entity_filters_action_filter_key ON realtime.subscription USING btree (subscription_id, entity, filters, action_filter);


--
-- Name: bname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX bname ON storage.buckets USING btree (name);


--
-- Name: bucketid_objname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX bucketid_objname ON storage.objects USING btree (bucket_id, name);


--
-- Name: buckets_analytics_unique_name_idx; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX buckets_analytics_unique_name_idx ON storage.buckets_analytics USING btree (name) WHERE (deleted_at IS NULL);


--
-- Name: idx_multipart_uploads_list; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_multipart_uploads_list ON storage.s3_multipart_uploads USING btree (bucket_id, key, created_at);


--
-- Name: idx_objects_bucket_id_name; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_objects_bucket_id_name ON storage.objects USING btree (bucket_id, name COLLATE "C");


--
-- Name: idx_objects_bucket_id_name_lower; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_objects_bucket_id_name_lower ON storage.objects USING btree (bucket_id, lower(name) COLLATE "C");


--
-- Name: name_prefix_search; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX name_prefix_search ON storage.objects USING btree (name text_pattern_ops);


--
-- Name: vector_indexes_name_bucket_id_idx; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX vector_indexes_name_bucket_id_idx ON storage.vector_indexes USING btree (name, bucket_id);


--
-- Name: users on_auth_user_created; Type: TRIGGER; Schema: auth; Owner: supabase_auth_admin
--

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


--
-- Name: subscription tr_check_filters; Type: TRIGGER; Schema: realtime; Owner: supabase_admin
--

CREATE TRIGGER tr_check_filters BEFORE INSERT OR UPDATE ON realtime.subscription FOR EACH ROW EXECUTE FUNCTION realtime.subscription_check_filters();


--
-- Name: buckets enforce_bucket_name_length_trigger; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER enforce_bucket_name_length_trigger BEFORE INSERT OR UPDATE OF name ON storage.buckets FOR EACH ROW EXECUTE FUNCTION storage.enforce_bucket_name_length();


--
-- Name: buckets protect_buckets_delete; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER protect_buckets_delete BEFORE DELETE ON storage.buckets FOR EACH STATEMENT EXECUTE FUNCTION storage.protect_delete();


--
-- Name: objects protect_objects_delete; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER protect_objects_delete BEFORE DELETE ON storage.objects FOR EACH STATEMENT EXECUTE FUNCTION storage.protect_delete();


--
-- Name: objects update_objects_updated_at; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER update_objects_updated_at BEFORE UPDATE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.update_updated_at_column();


--
-- Name: identities identities_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: mfa_challenges mfa_challenges_auth_factor_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_auth_factor_id_fkey FOREIGN KEY (factor_id) REFERENCES auth.mfa_factors(id) ON DELETE CASCADE;


--
-- Name: mfa_factors mfa_factors_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: oauth_authorizations oauth_authorizations_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_client_id_fkey FOREIGN KEY (client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- Name: oauth_authorizations oauth_authorizations_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: oauth_consents oauth_consents_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_client_id_fkey FOREIGN KEY (client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- Name: oauth_consents oauth_consents_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: one_time_tokens one_time_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: refresh_tokens refresh_tokens_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: saml_providers saml_providers_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_flow_state_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_flow_state_id_fkey FOREIGN KEY (flow_state_id) REFERENCES auth.flow_state(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: sessions sessions_oauth_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_oauth_client_id_fkey FOREIGN KEY (oauth_client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: sso_domains sso_domains_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: webauthn_challenges webauthn_challenges_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.webauthn_challenges
    ADD CONSTRAINT webauthn_challenges_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: webauthn_credentials webauthn_credentials_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.webauthn_credentials
    ADD CONSTRAINT webauthn_credentials_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: clients clients_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id);


--
-- Name: contracts contracts_quote_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contracts
    ADD CONSTRAINT contracts_quote_id_fkey FOREIGN KEY (quote_id) REFERENCES public.quotes(id);


--
-- Name: feedbacks feedbacks_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.feedbacks
    ADD CONSTRAINT feedbacks_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id);


--
-- Name: profiles profiles_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id);


--
-- Name: quotes quotes_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quotes
    ADD CONSTRAINT quotes_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clients(id);


--
-- Name: quotes quotes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quotes
    ADD CONSTRAINT quotes_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id);


--
-- Name: objects objects_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT "objects_bucketId_fkey" FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_upload_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_upload_id_fkey FOREIGN KEY (upload_id) REFERENCES storage.s3_multipart_uploads(id) ON DELETE CASCADE;


--
-- Name: vector_indexes vector_indexes_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.vector_indexes
    ADD CONSTRAINT vector_indexes_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets_vectors(id);


--
-- Name: audit_log_entries; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.audit_log_entries ENABLE ROW LEVEL SECURITY;

--
-- Name: flow_state; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.flow_state ENABLE ROW LEVEL SECURITY;

--
-- Name: identities; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.identities ENABLE ROW LEVEL SECURITY;

--
-- Name: instances; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.instances ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_amr_claims; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_amr_claims ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_challenges; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_challenges ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_factors; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_factors ENABLE ROW LEVEL SECURITY;

--
-- Name: one_time_tokens; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.one_time_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: refresh_tokens; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.refresh_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_providers; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.saml_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_relay_states; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.saml_relay_states ENABLE ROW LEVEL SECURITY;

--
-- Name: schema_migrations; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.schema_migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: sessions; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sessions ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_domains; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sso_domains ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_providers; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sso_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: users; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

--
-- Name: feedbacks Anonymous feedback insertion; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Anonymous feedback insertion" ON public.feedbacks FOR INSERT WITH CHECK (((auth.uid() = user_id) OR (user_id IS NULL)));


--
-- Name: quotes Public access via token; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Public access via token" ON public.quotes FOR SELECT USING ((public_token IS NOT NULL));


--
-- Name: contracts Public view contract; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Public view contract" ON public.contracts FOR SELECT USING (true);


--
-- Name: quotes Public view with token; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Public view with token" ON public.quotes FOR SELECT USING (true);


--
-- Name: clients Users can delete own clients; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can delete own clients" ON public.clients FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: quotes Users can delete own quotes; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can delete own quotes" ON public.quotes FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: clients Users can insert own clients; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can insert own clients" ON public.clients FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: feedbacks Users can insert own feedback; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can insert own feedback" ON public.feedbacks FOR INSERT WITH CHECK (((auth.uid() = user_id) OR (auth.uid() IS NULL)));


--
-- Name: profiles Users can insert own profile; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK ((auth.uid() = id));


--
-- Name: quotes Users can insert own quotes; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can insert own quotes" ON public.quotes FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: feedbacks Users can insert their own feedback; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can insert their own feedback" ON public.feedbacks FOR INSERT WITH CHECK (((auth.uid() = user_id) OR (user_id IS NULL)));


--
-- Name: contracts Users can manage contracts via quotes; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can manage contracts via quotes" ON public.contracts USING ((EXISTS ( SELECT 1
   FROM public.quotes
  WHERE ((quotes.id = contracts.quote_id) AND (quotes.user_id = auth.uid())))));


--
-- Name: contracts Users can manage own contracts; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can manage own contracts" ON public.contracts USING ((EXISTS ( SELECT 1
   FROM public.quotes
  WHERE ((quotes.id = contracts.quote_id) AND (quotes.user_id = auth.uid())))));


--
-- Name: quotes Users can manage own quotes; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can manage own quotes" ON public.quotes USING ((auth.uid() = user_id));


--
-- Name: profiles Users can select own profile; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can select own profile" ON public.profiles FOR SELECT USING ((auth.uid() = id));


--
-- Name: clients Users can update own clients; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can update own clients" ON public.clients FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: profiles Users can update own profile; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING ((auth.uid() = id));


--
-- Name: quotes Users can update own quotes; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can update own quotes" ON public.quotes FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: clients Users can view own clients; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view own clients" ON public.clients FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: contracts Users can view own contracts; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view own contracts" ON public.contracts FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.quotes
  WHERE ((quotes.id = contracts.quote_id) AND (quotes.user_id = auth.uid())))));


--
-- Name: feedbacks Users can view own feedback; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view own feedback" ON public.feedbacks FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: feedbacks Users can view own feedbacks; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view own feedbacks" ON public.feedbacks FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: profiles Users can view own profile; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING ((auth.uid() = id));


--
-- Name: quotes Users can view own quotes; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view own quotes" ON public.quotes FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: feedbacks Users can view their own feedback; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view their own feedback" ON public.feedbacks FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: clients; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

--
-- Name: contracts; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;

--
-- Name: feedbacks; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.feedbacks ENABLE ROW LEVEL SECURITY;

--
-- Name: profiles; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: quotes; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;

--
-- Name: subscription_audit_logs; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.subscription_audit_logs ENABLE ROW LEVEL SECURITY;

--
-- Name: subscription_audit_logs subscription_audit_logs_admin_read; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY subscription_audit_logs_admin_read ON public.subscription_audit_logs FOR SELECT TO authenticated USING (((auth.jwt() ->> 'user_role'::text) = 'admin'::text));


--
-- Name: subscription_audit_logs subscription_audit_logs_insert; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY subscription_audit_logs_insert ON public.subscription_audit_logs FOR INSERT TO authenticated WITH CHECK ((user_id = ( SELECT auth.uid() AS uid)));


--
-- Name: subscription_audit_logs subscription_audit_logs_select; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY subscription_audit_logs_select ON public.subscription_audit_logs FOR SELECT TO authenticated USING ((user_id = ( SELECT auth.uid() AS uid)));


--
-- Name: messages; Type: ROW SECURITY; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

--
-- Name: objects Authenticated Update; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Authenticated Update" ON storage.objects FOR UPDATE USING (((bucket_id = 'client-avatars'::text) AND (auth.role() = 'authenticated'::text)));


--
-- Name: objects Authenticated Upload; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Authenticated Upload" ON storage.objects FOR INSERT WITH CHECK (((bucket_id = 'client-avatars'::text) AND (auth.role() = 'authenticated'::text)));


--
-- Name: objects Public Access; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING ((bucket_id = 'client-avatars'::text));


--
-- Name: objects Public Access Labels; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Public Access Labels" ON storage.objects FOR SELECT USING ((bucket_id = 'labels'::text));


--
-- Name: objects Upload Labels; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Upload Labels" ON storage.objects FOR INSERT WITH CHECK ((bucket_id = 'labels'::text));


--
-- Name: objects Users can delete own avatar; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Users can delete own avatar" ON storage.objects FOR DELETE USING (((bucket_id = 'client-avatars'::text) AND ((storage.foldername(name))[1] = (auth.uid())::text)));


--
-- Name: objects Users can update own avatar; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Users can update own avatar" ON storage.objects FOR UPDATE USING (((bucket_id = 'client-avatars'::text) AND ((storage.foldername(name))[1] = (auth.uid())::text)));


--
-- Name: objects Users can upload own avatar; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Users can upload own avatar" ON storage.objects FOR INSERT WITH CHECK (((bucket_id = 'client-avatars'::text) AND ((storage.foldername(name))[1] = (auth.uid())::text)));


--
-- Name: buckets; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets_analytics; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.buckets_analytics ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets_vectors; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.buckets_vectors ENABLE ROW LEVEL SECURITY;

--
-- Name: migrations; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: objects; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.s3_multipart_uploads ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads_parts; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.s3_multipart_uploads_parts ENABLE ROW LEVEL SECURITY;

--
-- Name: vector_indexes; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.vector_indexes ENABLE ROW LEVEL SECURITY;

--
-- Name: supabase_realtime; Type: PUBLICATION; Schema: -; Owner: postgres
--

CREATE PUBLICATION supabase_realtime WITH (publish = 'insert, update, delete, truncate');


ALTER PUBLICATION supabase_realtime OWNER TO postgres;

--
-- Name: SCHEMA auth; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA auth TO anon;
GRANT USAGE ON SCHEMA auth TO authenticated;
GRANT USAGE ON SCHEMA auth TO service_role;
GRANT ALL ON SCHEMA auth TO supabase_auth_admin;
GRANT ALL ON SCHEMA auth TO dashboard_user;
GRANT USAGE ON SCHEMA auth TO postgres;


--
-- Name: SCHEMA cron; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA cron TO postgres WITH GRANT OPTION;


--
-- Name: SCHEMA extensions; Type: ACL; Schema: -; Owner: postgres
--

GRANT USAGE ON SCHEMA extensions TO anon;
GRANT USAGE ON SCHEMA extensions TO authenticated;
GRANT USAGE ON SCHEMA extensions TO service_role;
GRANT ALL ON SCHEMA extensions TO dashboard_user;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT USAGE ON SCHEMA public TO postgres;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;


--
-- Name: SCHEMA realtime; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA realtime TO postgres;
GRANT USAGE ON SCHEMA realtime TO anon;
GRANT USAGE ON SCHEMA realtime TO authenticated;
GRANT USAGE ON SCHEMA realtime TO service_role;
GRANT ALL ON SCHEMA realtime TO supabase_realtime_admin;


--
-- Name: SCHEMA storage; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA storage TO postgres WITH GRANT OPTION;
GRANT USAGE ON SCHEMA storage TO anon;
GRANT USAGE ON SCHEMA storage TO authenticated;
GRANT USAGE ON SCHEMA storage TO service_role;
GRANT ALL ON SCHEMA storage TO supabase_storage_admin WITH GRANT OPTION;
GRANT ALL ON SCHEMA storage TO dashboard_user;


--
-- Name: SCHEMA vault; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA vault TO postgres WITH GRANT OPTION;
GRANT USAGE ON SCHEMA vault TO service_role;


--
-- Name: FUNCTION email(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.email() TO dashboard_user;


--
-- Name: FUNCTION jwt(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.jwt() TO postgres;
GRANT ALL ON FUNCTION auth.jwt() TO dashboard_user;


--
-- Name: FUNCTION role(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.role() TO dashboard_user;


--
-- Name: FUNCTION uid(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.uid() TO dashboard_user;


--
-- Name: FUNCTION alter_job(job_id bigint, schedule text, command text, database text, username text, active boolean); Type: ACL; Schema: cron; Owner: supabase_admin
--

GRANT ALL ON FUNCTION cron.alter_job(job_id bigint, schedule text, command text, database text, username text, active boolean) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION job_cache_invalidate(); Type: ACL; Schema: cron; Owner: supabase_admin
--

GRANT ALL ON FUNCTION cron.job_cache_invalidate() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION schedule(schedule text, command text); Type: ACL; Schema: cron; Owner: supabase_admin
--

GRANT ALL ON FUNCTION cron.schedule(schedule text, command text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION schedule(job_name text, schedule text, command text); Type: ACL; Schema: cron; Owner: supabase_admin
--

GRANT ALL ON FUNCTION cron.schedule(job_name text, schedule text, command text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION schedule_in_database(job_name text, schedule text, command text, database text, username text, active boolean); Type: ACL; Schema: cron; Owner: supabase_admin
--

GRANT ALL ON FUNCTION cron.schedule_in_database(job_name text, schedule text, command text, database text, username text, active boolean) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION unschedule(job_id bigint); Type: ACL; Schema: cron; Owner: supabase_admin
--

GRANT ALL ON FUNCTION cron.unschedule(job_id bigint) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION unschedule(job_name text); Type: ACL; Schema: cron; Owner: supabase_admin
--

GRANT ALL ON FUNCTION cron.unschedule(job_name text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION armor(bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.armor(bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.armor(bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.armor(bytea) TO dashboard_user;


--
-- Name: FUNCTION armor(bytea, text[], text[]); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.armor(bytea, text[], text[]) FROM postgres;
GRANT ALL ON FUNCTION extensions.armor(bytea, text[], text[]) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.armor(bytea, text[], text[]) TO dashboard_user;


--
-- Name: FUNCTION crypt(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.crypt(text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.crypt(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.crypt(text, text) TO dashboard_user;


--
-- Name: FUNCTION dearmor(text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.dearmor(text) FROM postgres;
GRANT ALL ON FUNCTION extensions.dearmor(text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.dearmor(text) TO dashboard_user;


--
-- Name: FUNCTION decrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION decrypt_iv(bytea, bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION digest(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.digest(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.digest(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.digest(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION digest(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.digest(text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.digest(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.digest(text, text) TO dashboard_user;


--
-- Name: FUNCTION encrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION encrypt_iv(bytea, bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION gen_random_bytes(integer); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_random_bytes(integer) FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_random_bytes(integer) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_random_bytes(integer) TO dashboard_user;


--
-- Name: FUNCTION gen_random_uuid(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_random_uuid() FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_random_uuid() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_random_uuid() TO dashboard_user;


--
-- Name: FUNCTION gen_salt(text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_salt(text) FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_salt(text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_salt(text) TO dashboard_user;


--
-- Name: FUNCTION gen_salt(text, integer); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_salt(text, integer) FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_salt(text, integer) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_salt(text, integer) TO dashboard_user;


--
-- Name: FUNCTION grant_pg_cron_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION extensions.grant_pg_cron_access() FROM supabase_admin;
GRANT ALL ON FUNCTION extensions.grant_pg_cron_access() TO supabase_admin WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.grant_pg_cron_access() TO dashboard_user;


--
-- Name: FUNCTION grant_pg_graphql_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.grant_pg_graphql_access() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION grant_pg_net_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION extensions.grant_pg_net_access() FROM supabase_admin;
GRANT ALL ON FUNCTION extensions.grant_pg_net_access() TO supabase_admin WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.grant_pg_net_access() TO dashboard_user;


--
-- Name: FUNCTION hmac(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.hmac(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.hmac(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.hmac(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION hmac(text, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.hmac(text, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.hmac(text, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.hmac(text, text, text) TO dashboard_user;


--
-- Name: FUNCTION pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone) FROM postgres;
GRANT ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone) TO dashboard_user;


--
-- Name: FUNCTION pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) FROM postgres;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) TO dashboard_user;


--
-- Name: FUNCTION pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean) FROM postgres;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean) TO dashboard_user;


--
-- Name: FUNCTION pgp_armor_headers(text, OUT key text, OUT value text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) TO dashboard_user;


--
-- Name: FUNCTION pgp_key_id(bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_key_id(bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_key_id(bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_key_id(bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt(text, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt(text, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt_bytea(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt_bytea(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt_bytea(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt_bytea(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt(text, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt_bytea(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt_bytea(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgrst_ddl_watch(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgrst_ddl_watch() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgrst_drop_watch(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgrst_drop_watch() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION set_graphql_placeholder(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.set_graphql_placeholder() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION uuid_generate_v1(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v1() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1() TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v1mc(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v1mc() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1mc() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1mc() TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v3(namespace uuid, name text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v4(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v4() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v4() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v4() TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v5(namespace uuid, name text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) TO dashboard_user;


--
-- Name: FUNCTION uuid_nil(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_nil() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_nil() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_nil() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_dns(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_dns() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_dns() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_dns() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_oid(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_oid() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_oid() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_oid() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_url(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_url() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_url() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_url() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_x500(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_x500() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_x500() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_x500() TO dashboard_user;


--
-- Name: FUNCTION graphql("operationName" text, query text, variables jsonb, extensions jsonb); Type: ACL; Schema: graphql_public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO postgres;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO anon;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO authenticated;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO service_role;


--
-- Name: FUNCTION pg_reload_conf(); Type: ACL; Schema: pg_catalog; Owner: supabase_admin
--

GRANT ALL ON FUNCTION pg_catalog.pg_reload_conf() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION get_auth(p_usename text); Type: ACL; Schema: pgbouncer; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION pgbouncer.get_auth(p_usename text) FROM PUBLIC;
GRANT ALL ON FUNCTION pgbouncer.get_auth(p_usename text) TO pgbouncer;


--
-- Name: FUNCTION check_quote_access(token_input uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.check_quote_access(token_input uuid) TO anon;
GRANT ALL ON FUNCTION public.check_quote_access(token_input uuid) TO authenticated;
GRANT ALL ON FUNCTION public.check_quote_access(token_input uuid) TO service_role;


--
-- Name: FUNCTION expire_subscriptions_and_log(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.expire_subscriptions_and_log() TO anon;
GRANT ALL ON FUNCTION public.expire_subscriptions_and_log() TO authenticated;
GRANT ALL ON FUNCTION public.expire_subscriptions_and_log() TO service_role;


--
-- Name: FUNCTION get_quote_secure(token_input uuid, password_input text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_quote_secure(token_input uuid, password_input text) TO anon;
GRANT ALL ON FUNCTION public.get_quote_secure(token_input uuid, password_input text) TO authenticated;
GRANT ALL ON FUNCTION public.get_quote_secure(token_input uuid, password_input text) TO service_role;


--
-- Name: FUNCTION handle_new_user(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.handle_new_user() TO anon;
GRANT ALL ON FUNCTION public.handle_new_user() TO authenticated;
GRANT ALL ON FUNCTION public.handle_new_user() TO service_role;


--
-- Name: FUNCTION mark_quote_viewed(quote_id_input uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.mark_quote_viewed(quote_id_input uuid) TO anon;
GRANT ALL ON FUNCTION public.mark_quote_viewed(quote_id_input uuid) TO authenticated;
GRANT ALL ON FUNCTION public.mark_quote_viewed(quote_id_input uuid) TO service_role;


--
-- Name: FUNCTION apply_rls(wal jsonb, max_record_bytes integer); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO postgres;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO anon;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO authenticated;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO service_role;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO supabase_realtime_admin;


--
-- Name: FUNCTION broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) TO postgres;
GRANT ALL ON FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) TO dashboard_user;


--
-- Name: FUNCTION build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO postgres;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO anon;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO authenticated;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO service_role;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO supabase_realtime_admin;


--
-- Name: FUNCTION "cast"(val text, type_ regtype); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO postgres;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO dashboard_user;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO anon;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO authenticated;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO service_role;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO supabase_realtime_admin;


--
-- Name: FUNCTION check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO postgres;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO anon;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO authenticated;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO service_role;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO supabase_realtime_admin;


--
-- Name: FUNCTION is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO postgres;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO anon;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO authenticated;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO service_role;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO supabase_realtime_admin;


--
-- Name: FUNCTION list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO postgres;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO dashboard_user;


--
-- Name: FUNCTION quote_wal2json(entity regclass); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO postgres;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO anon;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO authenticated;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO service_role;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO supabase_realtime_admin;


--
-- Name: FUNCTION send(payload jsonb, event text, topic text, private boolean); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) TO postgres;
GRANT ALL ON FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) TO dashboard_user;


--
-- Name: FUNCTION subscription_check_filters(); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO postgres;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO dashboard_user;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO anon;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO authenticated;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO service_role;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO supabase_realtime_admin;


--
-- Name: FUNCTION to_regrole(role_name text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO postgres;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO anon;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO authenticated;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO service_role;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO supabase_realtime_admin;


--
-- Name: FUNCTION topic(); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION realtime.topic() TO postgres;
GRANT ALL ON FUNCTION realtime.topic() TO dashboard_user;


--
-- Name: FUNCTION _crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault._crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault._crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea) TO service_role;


--
-- Name: FUNCTION create_secret(new_secret text, new_name text, new_description text, new_key_id uuid); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault.create_secret(new_secret text, new_name text, new_description text, new_key_id uuid) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault.create_secret(new_secret text, new_name text, new_description text, new_key_id uuid) TO service_role;


--
-- Name: FUNCTION update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault.update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault.update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid) TO service_role;


--
-- Name: TABLE audit_log_entries; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.audit_log_entries TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.audit_log_entries TO postgres;
GRANT SELECT ON TABLE auth.audit_log_entries TO postgres WITH GRANT OPTION;


--
-- Name: TABLE custom_oauth_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.custom_oauth_providers TO postgres;
GRANT ALL ON TABLE auth.custom_oauth_providers TO dashboard_user;


--
-- Name: TABLE flow_state; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.flow_state TO postgres;
GRANT SELECT ON TABLE auth.flow_state TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.flow_state TO dashboard_user;


--
-- Name: TABLE identities; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.identities TO postgres;
GRANT SELECT ON TABLE auth.identities TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.identities TO dashboard_user;


--
-- Name: TABLE instances; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.instances TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.instances TO postgres;
GRANT SELECT ON TABLE auth.instances TO postgres WITH GRANT OPTION;


--
-- Name: TABLE mfa_amr_claims; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_amr_claims TO postgres;
GRANT SELECT ON TABLE auth.mfa_amr_claims TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_amr_claims TO dashboard_user;


--
-- Name: TABLE mfa_challenges; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_challenges TO postgres;
GRANT SELECT ON TABLE auth.mfa_challenges TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_challenges TO dashboard_user;


--
-- Name: TABLE mfa_factors; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_factors TO postgres;
GRANT SELECT ON TABLE auth.mfa_factors TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_factors TO dashboard_user;


--
-- Name: TABLE oauth_authorizations; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_authorizations TO postgres;
GRANT ALL ON TABLE auth.oauth_authorizations TO dashboard_user;


--
-- Name: TABLE oauth_client_states; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_client_states TO postgres;
GRANT ALL ON TABLE auth.oauth_client_states TO dashboard_user;


--
-- Name: TABLE oauth_clients; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_clients TO postgres;
GRANT ALL ON TABLE auth.oauth_clients TO dashboard_user;


--
-- Name: TABLE oauth_consents; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_consents TO postgres;
GRANT ALL ON TABLE auth.oauth_consents TO dashboard_user;


--
-- Name: TABLE one_time_tokens; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.one_time_tokens TO postgres;
GRANT SELECT ON TABLE auth.one_time_tokens TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.one_time_tokens TO dashboard_user;


--
-- Name: TABLE refresh_tokens; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.refresh_tokens TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.refresh_tokens TO postgres;
GRANT SELECT ON TABLE auth.refresh_tokens TO postgres WITH GRANT OPTION;


--
-- Name: SEQUENCE refresh_tokens_id_seq; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON SEQUENCE auth.refresh_tokens_id_seq TO dashboard_user;
GRANT ALL ON SEQUENCE auth.refresh_tokens_id_seq TO postgres;


--
-- Name: TABLE saml_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.saml_providers TO postgres;
GRANT SELECT ON TABLE auth.saml_providers TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.saml_providers TO dashboard_user;


--
-- Name: TABLE saml_relay_states; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.saml_relay_states TO postgres;
GRANT SELECT ON TABLE auth.saml_relay_states TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.saml_relay_states TO dashboard_user;


--
-- Name: TABLE schema_migrations; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT SELECT ON TABLE auth.schema_migrations TO postgres WITH GRANT OPTION;


--
-- Name: TABLE sessions; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sessions TO postgres;
GRANT SELECT ON TABLE auth.sessions TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sessions TO dashboard_user;


--
-- Name: TABLE sso_domains; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sso_domains TO postgres;
GRANT SELECT ON TABLE auth.sso_domains TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sso_domains TO dashboard_user;


--
-- Name: TABLE sso_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sso_providers TO postgres;
GRANT SELECT ON TABLE auth.sso_providers TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sso_providers TO dashboard_user;


--
-- Name: TABLE users; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.users TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.users TO postgres;
GRANT SELECT ON TABLE auth.users TO postgres WITH GRANT OPTION;


--
-- Name: TABLE webauthn_challenges; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.webauthn_challenges TO postgres;
GRANT ALL ON TABLE auth.webauthn_challenges TO dashboard_user;


--
-- Name: TABLE webauthn_credentials; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.webauthn_credentials TO postgres;
GRANT ALL ON TABLE auth.webauthn_credentials TO dashboard_user;


--
-- Name: TABLE job; Type: ACL; Schema: cron; Owner: supabase_admin
--

GRANT SELECT ON TABLE cron.job TO postgres WITH GRANT OPTION;


--
-- Name: TABLE job_run_details; Type: ACL; Schema: cron; Owner: supabase_admin
--

GRANT ALL ON TABLE cron.job_run_details TO postgres WITH GRANT OPTION;


--
-- Name: TABLE pg_stat_statements; Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON TABLE extensions.pg_stat_statements FROM postgres;
GRANT ALL ON TABLE extensions.pg_stat_statements TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE extensions.pg_stat_statements TO dashboard_user;


--
-- Name: TABLE pg_stat_statements_info; Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON TABLE extensions.pg_stat_statements_info FROM postgres;
GRANT ALL ON TABLE extensions.pg_stat_statements_info TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE extensions.pg_stat_statements_info TO dashboard_user;


--
-- Name: TABLE clients; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.clients TO anon;
GRANT ALL ON TABLE public.clients TO authenticated;
GRANT ALL ON TABLE public.clients TO service_role;


--
-- Name: TABLE contracts; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.contracts TO anon;
GRANT ALL ON TABLE public.contracts TO authenticated;
GRANT ALL ON TABLE public.contracts TO service_role;


--
-- Name: TABLE feedbacks; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.feedbacks TO anon;
GRANT ALL ON TABLE public.feedbacks TO authenticated;
GRANT ALL ON TABLE public.feedbacks TO service_role;


--
-- Name: TABLE profiles; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.profiles TO anon;
GRANT ALL ON TABLE public.profiles TO authenticated;
GRANT ALL ON TABLE public.profiles TO service_role;


--
-- Name: TABLE quotes; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.quotes TO anon;
GRANT ALL ON TABLE public.quotes TO authenticated;
GRANT ALL ON TABLE public.quotes TO service_role;


--
-- Name: TABLE subscription_audit_logs; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.subscription_audit_logs TO anon;
GRANT ALL ON TABLE public.subscription_audit_logs TO authenticated;
GRANT ALL ON TABLE public.subscription_audit_logs TO service_role;


--
-- Name: SEQUENCE subscription_audit_logs_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.subscription_audit_logs_id_seq TO anon;
GRANT ALL ON SEQUENCE public.subscription_audit_logs_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.subscription_audit_logs_id_seq TO service_role;


--
-- Name: TABLE messages; Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON TABLE realtime.messages TO postgres;
GRANT ALL ON TABLE realtime.messages TO dashboard_user;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO anon;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO authenticated;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO service_role;


--
-- Name: TABLE schema_migrations; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.schema_migrations TO postgres;
GRANT ALL ON TABLE realtime.schema_migrations TO dashboard_user;
GRANT SELECT ON TABLE realtime.schema_migrations TO anon;
GRANT SELECT ON TABLE realtime.schema_migrations TO authenticated;
GRANT SELECT ON TABLE realtime.schema_migrations TO service_role;
GRANT ALL ON TABLE realtime.schema_migrations TO supabase_realtime_admin;


--
-- Name: TABLE subscription; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.subscription TO postgres;
GRANT ALL ON TABLE realtime.subscription TO dashboard_user;
GRANT SELECT ON TABLE realtime.subscription TO anon;
GRANT SELECT ON TABLE realtime.subscription TO authenticated;
GRANT SELECT ON TABLE realtime.subscription TO service_role;
GRANT ALL ON TABLE realtime.subscription TO supabase_realtime_admin;


--
-- Name: SEQUENCE subscription_id_seq; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO postgres;
GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO dashboard_user;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO anon;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO authenticated;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO service_role;
GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO supabase_realtime_admin;


--
-- Name: TABLE buckets; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

REVOKE ALL ON TABLE storage.buckets FROM supabase_storage_admin;
GRANT ALL ON TABLE storage.buckets TO supabase_storage_admin WITH GRANT OPTION;
GRANT ALL ON TABLE storage.buckets TO service_role;
GRANT ALL ON TABLE storage.buckets TO authenticated;
GRANT ALL ON TABLE storage.buckets TO anon;
GRANT ALL ON TABLE storage.buckets TO postgres WITH GRANT OPTION;


--
-- Name: TABLE buckets_analytics; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.buckets_analytics TO service_role;
GRANT ALL ON TABLE storage.buckets_analytics TO authenticated;
GRANT ALL ON TABLE storage.buckets_analytics TO anon;


--
-- Name: TABLE buckets_vectors; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT SELECT ON TABLE storage.buckets_vectors TO service_role;
GRANT SELECT ON TABLE storage.buckets_vectors TO authenticated;
GRANT SELECT ON TABLE storage.buckets_vectors TO anon;


--
-- Name: TABLE objects; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

REVOKE ALL ON TABLE storage.objects FROM supabase_storage_admin;
GRANT ALL ON TABLE storage.objects TO supabase_storage_admin WITH GRANT OPTION;
GRANT ALL ON TABLE storage.objects TO service_role;
GRANT ALL ON TABLE storage.objects TO authenticated;
GRANT ALL ON TABLE storage.objects TO anon;
GRANT ALL ON TABLE storage.objects TO postgres WITH GRANT OPTION;


--
-- Name: TABLE s3_multipart_uploads; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.s3_multipart_uploads TO service_role;
GRANT SELECT ON TABLE storage.s3_multipart_uploads TO authenticated;
GRANT SELECT ON TABLE storage.s3_multipart_uploads TO anon;


--
-- Name: TABLE s3_multipart_uploads_parts; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.s3_multipart_uploads_parts TO service_role;
GRANT SELECT ON TABLE storage.s3_multipart_uploads_parts TO authenticated;
GRANT SELECT ON TABLE storage.s3_multipart_uploads_parts TO anon;


--
-- Name: TABLE vector_indexes; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT SELECT ON TABLE storage.vector_indexes TO service_role;
GRANT SELECT ON TABLE storage.vector_indexes TO authenticated;
GRANT SELECT ON TABLE storage.vector_indexes TO anon;


--
-- Name: TABLE secrets; Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT SELECT,REFERENCES,DELETE,TRUNCATE ON TABLE vault.secrets TO postgres WITH GRANT OPTION;
GRANT SELECT,DELETE ON TABLE vault.secrets TO service_role;


--
-- Name: TABLE decrypted_secrets; Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT SELECT,REFERENCES,DELETE,TRUNCATE ON TABLE vault.decrypted_secrets TO postgres WITH GRANT OPTION;
GRANT SELECT,DELETE ON TABLE vault.decrypted_secrets TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON SEQUENCES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON FUNCTIONS TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON TABLES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: cron; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA cron GRANT ALL ON SEQUENCES TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: cron; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA cron GRANT ALL ON FUNCTIONS TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: cron; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA cron GRANT ALL ON TABLES TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON SEQUENCES TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON FUNCTIONS TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON TABLES TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON SEQUENCES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON FUNCTIONS TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON TABLES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO service_role;


--
-- Name: issue_graphql_placeholder; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_graphql_placeholder ON sql_drop
         WHEN TAG IN ('DROP EXTENSION')
   EXECUTE FUNCTION extensions.set_graphql_placeholder();


ALTER EVENT TRIGGER issue_graphql_placeholder OWNER TO supabase_admin;

--
-- Name: issue_pg_cron_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_cron_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_cron_access();


ALTER EVENT TRIGGER issue_pg_cron_access OWNER TO supabase_admin;

--
-- Name: issue_pg_graphql_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_graphql_access ON ddl_command_end
         WHEN TAG IN ('CREATE FUNCTION')
   EXECUTE FUNCTION extensions.grant_pg_graphql_access();


ALTER EVENT TRIGGER issue_pg_graphql_access OWNER TO supabase_admin;

--
-- Name: issue_pg_net_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_net_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_net_access();


ALTER EVENT TRIGGER issue_pg_net_access OWNER TO supabase_admin;

--
-- Name: pgrst_ddl_watch; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER pgrst_ddl_watch ON ddl_command_end
   EXECUTE FUNCTION extensions.pgrst_ddl_watch();


ALTER EVENT TRIGGER pgrst_ddl_watch OWNER TO supabase_admin;

--
-- Name: pgrst_drop_watch; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER pgrst_drop_watch ON sql_drop
   EXECUTE FUNCTION extensions.pgrst_drop_watch();


ALTER EVENT TRIGGER pgrst_drop_watch OWNER TO supabase_admin;

--
-- PostgreSQL database dump complete
--

\unrestrict M33kpbMKQapFhblndo2fNDcgtP65Qk8MHMS25Gc11MsvSP2I3PQx810eNcXPKy0

