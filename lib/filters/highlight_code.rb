class HighlightCode < Nanoc::Filter
  identifier :highlight_code

  # Extract code snippets marked with ``` and prepare them for
  # highlight.js
  #
  # @param [String] content The content to filter
  # @param [String] params This method takes no options.
  # @return [String] The filtered content
  def run(content, params = {})
    content.gsub(/^(\s*)```([a-z]*)$(.*?)^\s*```$/m) do |m|
      pre_space = $1
      lang = $2.empty? ? "no-highlight" : $2
      snippet = $3.gsub(/\A\n+\s*/m, '')
      %Q(#{pre_space}<pre><code class="#{lang}">#{html_escape(snippet)}</code></pre>)
    end
  end
end
