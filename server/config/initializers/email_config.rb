email_config = Rails.application.config_for(:email_config)

outgoing_email_address = email_config["email"]
outgoing_email_password = email_config["password"]
