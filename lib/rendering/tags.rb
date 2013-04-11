require 'image_size'

def image_tag(identifier, params = {})
  item = lookup_item(identifier)
  img = ImageSize.new(IO.read(item.raw_filename))
  klass = if params[:class]
            'class="%s" ' % params[:class]
          else
            ""
          end
  fmt = '<img src="%s.%s" height="%d" width="%d" %s/>'
  fmt % [item.identifier.chop, item[:extension],
         img.height, img.width, klass]
end

def css_link(identifier, params = {})
  item = lookup_item(identifier)
  '<link rel="stylesheet" href="%s.css">' % [item.identifier.chop]
end

def js_link(identifier, params = {})
  item = lookup_item(identifier)
  '<script src="%s.js"></script>' % [item.identifier.chop]
end
