require "rack/jekyll"
run Rack::Jekyll.new(config: "_config_development.yml", force_build: true, auto: true)
