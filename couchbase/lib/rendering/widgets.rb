require 'set'

def nav_li_class(entry)
  classes = Set.new
  if entry[:href] == @item_rep.path
    classes << "active "
  end
  if entry[:subnav]
    classes << "dropdown"
    entry[:subnav].each do |subentry|
      if subentry[:href] == @item_rep.path
        classes << "active "
      end
    end
  end
  classes.to_a.join(" ")
end

def nav_a_class(entry)
  {}.tap do |attrs|
    attrs['href'] = entry[:href] || "#"
    if entry[:subnav]
      attrs['class'] = "dropdown-toggle"
      attrs['data-toggle'] = "dropdown"
    end
  end
end

def versions_for(item)
  @site.config[:versions].each do |entry|
    versions = []
    entry[:nums].each do |num|
      # remove dots from number and
      # concatenate result with href, e.g.
      #   entry[:href] = "/dev-guide/"
      #   num = 2.0
      #   #=> {:num => "2.0", :href => "/dev-guide-20/"}
      ver = {:num => num.to_s}
      ver[:before] =entry[:href]
      ver[:href] = entry[:href].sub(/\/?\Z/, "-#{num.to_s.gsub(/\./, '')}/")
      versions << ver
    end
    if versions.any?{|p| @item_rep.path == p[:href]}
      return versions
    end
  end
  nil
end

def ver_li_class(version)
  if version[:href] == @item_rep.path
    "active"
  end
end
