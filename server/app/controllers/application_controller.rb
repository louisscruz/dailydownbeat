class ApplicationController < ActionController::API
  include ActionController::RequestForgeryProtection
  include SessionsHelper
  serialization_scope :this_user
  before_action :add_allow_credentials_headers
  protect_from_forgery with: :null_session, only: Proc.new { |c| c.request.format.json? }

  protected

  def set_pagination_headers(name, options = {})
    scope = instance_variable_get("@#{name}")
    request_params = request.query_parameters
    url_without_params = request.original_url.slice(0..(request.original_url.index("?")-1)) unless request_params.empty?
    url_without_params ||= request.original_url

    page = {}
    page[:first] = 1 if scope.total_pages > 1 && !scope.first_page?
    page[:last] = scope.total_pages  if scope.total_pages > 1 && !scope.last_page?
    page[:next] = scope.current_page + 1 unless scope.last_page?
    page[:prev] = scope.current_page - 1 unless scope.first_page?

    pagination_links = []
    page.each do |k, v|
      new_request_hash = request_params.merge({:page => v})
      pagination_links << "<#{url_without_params}?#{new_request_hash.to_param}>; rel=\"#{k}\""
    end
    headers["Link"] = pagination_links.join(", ")
  end

  def add_allow_credentials_headers
    response.headers['Access-Control-Allow-Origin'] = request.headers['Origin'] || '*'
    response.headers['Access-Control-Allow-Credentials'] = 'true'
  end
end
