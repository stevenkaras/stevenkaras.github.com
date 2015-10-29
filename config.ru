require "rack/jekyll"
run Rack::Jekyll.new(config: "_config_development.yml", force_rebuild: true, watch: true)
