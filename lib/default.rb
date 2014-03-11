require 'pp'

include Nanoc3::Helpers::Rendering
include Nanoc3::Helpers::HTMLEscape
include Nanoc3::Helpers::LinkTo

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
  if item = lookup_item(identifier)
    item.compiled_content
  end
end

class DocVersion
  attr_accessor :current, :name, :v

  def initialize(name, v, current)
    @name = name
    @current = current
    @v = v
  end

  def link_class
    @current ? "current" : "alternate"
  end

  def link
    "/#{name}-#{v}/"
  end
end

def parent_id(item)
  if item[:ng]
    (item[:index] ? item : item.parent).identifier.gsub('/', '')
  else
    item[:title]
  end
end

def base_name(item)
  identifier = parent_id(item)
  if identifier
    li = identifier.rindex '-'
    li ? identifier[0...li] : identifier
  end
end

def all_versions
  identifier = base_name(@item)
  if identifier
    thisv = parent_id(@item)[identifier.length+1..-1]
    vdata = @site.config[:versions][identifier.to_sym][:versions].map do |v|
      DocVersion.new(identifier, v.to_s, v.to_s == thisv)
    end
  end
  vdata || []
rescue
  []
end

def section_name
  identifier = base_name(@item)
  @site.config[:versions][identifier.to_sym][:name]
rescue
  ""
end

$LOAD_PATH.unshift(File.dirname(__FILE__))
require 'filters/highlight_code'
require 'rendering/tags'
require 'rendering/widgets'
