require 'nokogiri'

class TableOfContents
  def initialize(container)
    @root = container
    @container = container
    @cursor = nil
  end

  def insert(entry)
    if @cursor
      if @cursor[:level] < entry[:level]
        @container = @cursor[:children]
        entry[:parent] = @cursor
      elsif @cursor[:level] > entry[:level]
        begin
          @cursor = @cursor[:parent]
          if @cursor && @cursor[:parent]
            @container = @cursor[:parent][:children]
            entry[:parent] = @cursor[:parent]
          else
            @container = @root
            entry[:parent] = nil
          end
        end while @cursor && @cursor[:level] > entry[:level]
      else
        entry[:parent] = @cursor[:parent]
      end
    end
    @container << entry
    @cursor = entry
  end
end

class ExtractToc < Nanoc::Filter
  identifier :extract_toc

  # Extract table of contents from markdown source
  # and store it in @item[:toc] attribute
  #
  # @param [String] content The content to filter
  # @param [String] params This method takes no options.
  # @return [String] The filtered content
  def run(content, params = {})
    doc = Nokogiri::HTML::DocumentFragment.parse(content)
    toc = TableOfContents.new(@item.toc)
    cursor = nil
    container = @item.toc
    doc.css('h1, h2, h3, h4').each do |heading|
      heading[:id] = dasherize(heading.content)
      heading[:class] = "jumptarget"
      entry = {
        :level => heading.name[1].to_i,
        :title => heading.content,
        :href => "##{heading[:id]}",
        :parent => nil,
        :children => []
      }
      toc.insert(entry)
      if params[:anchors]
        node = %Q(<a class="anchor" href="#{entry[:href]}">&para;</a>)
        heading.add_child(node)
      end
    end
    doc.to_html
  end

  def dasherize(string)
    string.downcase.gsub(/[\s_]+/, '-').gsub(/[^-a-z0-9_]+/, '')
  end
end
