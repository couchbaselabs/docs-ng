require 'pp'

include Nanoc3::Helpers::Rendering
include Nanoc3::Helpers::HTMLEscape

def lookup_item(identifier)
  cleaned_identifier = identifier.cleaned_identifier
  # I know it is slow, but after all it is static site generator :)
  @site.items.find do |ii|
    ii.identifier == cleaned_identifier
  end
end

# This method might be helpful when you need to include contents into
# another one. It is accessible in content/* files.
#
# Include item in the ERB template
#
#   <%= include_item 'assets/js/bootstrap' %>
def include_item(identifier)
  lookup_item(identifier).compiled_content
end

$LOAD_PATH.unshift(File.dirname(__FILE__))
require 'filters/highlight_code'
require 'rendering/tags'
require 'rendering/widgets'
