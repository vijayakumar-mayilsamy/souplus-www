ActionMailer::Base.smtp_settings = {
  :address                => "smtp.gmail.com",
  :port                   => 587,
  :domain                 => "souplus.com",
  :user_name              => "support@souplus.com",
  :password               => "robotrocks",
  :authentication         => "plain",
  :enable_starttls_auto   => true
}