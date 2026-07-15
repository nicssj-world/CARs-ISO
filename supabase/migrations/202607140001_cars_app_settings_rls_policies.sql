ALTER TABLE cars_app_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS cars_app_settings_select ON cars_app_settings;
CREATE POLICY cars_app_settings_select ON cars_app_settings
  FOR SELECT USING (true);

DROP POLICY IF EXISTS cars_app_settings_insert ON cars_app_settings;
CREATE POLICY cars_app_settings_insert ON cars_app_settings
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS cars_app_settings_update ON cars_app_settings;
CREATE POLICY cars_app_settings_update ON cars_app_settings
  FOR UPDATE USING (true) WITH CHECK (true);
