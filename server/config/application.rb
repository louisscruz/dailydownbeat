require File.expand_path('../boot', __FILE__)

require "rails"
# Pick the frameworks you want:
require "active_model/railtie"
require "active_job/railtie"
require "active_record/railtie"
require "action_controller/railtie"
require "action_mailer/railtie"
require "action_view/railtie"
require "action_cable/engine"
# require "sprockets/railtie"
require "rails/test_unit/railtie"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module DailyDownbeat
  class Application < Rails::Application
    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.

    # Only loads a smaller set of middleware suitable for API only apps.
    # Middleware like session, flash, cookies can be added back manually.
    # Skip views, helpers and assets when generating a new resource.
    config.api_only = true
    config.before_configuration do
      env_file = File.join(Rails.root, 'config', 'local_env.yml')
      YAML.load(File.open(env_file)).each do |key, value|
        ENV[key.to_s] = value
      end if File.exists?(env_file)
    end
    config.autoload_paths += Dir["#{config.root}/lib/**/"]
    config.autoload_paths += %W(#{config.root}/lib)
    #config.middleware.use ActionDispatch::Session::CacheStore
    #config.middleware.use ActionDispatch::Session::CookieStore
    #config.middleware.use ActionDispatch::Session::MemCacheStore
    Kaminari.configure do |config|
      config.default_per_page = 30
    end
    #config.action_dispatch.default_headers.merge!('X-Total-Count' => '0')
    #config.cache_store = :memory_store
    config.action_mailer.delivery_method = :smtp
    config.action_mailer.smtp_settings = {
      :authentication => :plain,
      :address => "smtp.mailgun.org",
      :port => 587,
      :domain => "http://localhost:3000",
      :user_name => "postmaster@mg.dailydownbeat.com",
      :password => ENV["EMAIL_MAILGUN_PASSWORD"]
    }
    #config.action_dispatch
    #config.action_dispatch.default_headers = {
        #'Access-Control-Allow-Origin' => '*',
        #'Access-Control-Request-Method' => 'GET, PATCH, PUT, POST, OPTIONS, DELETE',
        #'Access-Control-Allow-Headers:' => 'Origin, X-Requested-With, Content-Type, Accept, x-total'
    #}
    #config.middleware.insert_before 0, "Rack::Cors" do
      #allow do
        #origins '*'
        #resource '*', headers: :any, methods: [:get, :post, :options, :patch, :delete], expose: ['X-Total-Count']
      #end
    #end
    config.middleware.insert_before 0, "Rack::Cors" do
      allow do
        origins '*'
        resource '*', :headers => :any, :methods => :any
      end
    end
  end
end
