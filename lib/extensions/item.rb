class Nanoc::Item
  def digest
    @digest ||= if binary?
                  File.read(raw_filename)
                else
                  raw_content
                end.checksum
  end

  def toc
    @toc ||= Array.new
  end

  def self.hierarchy
    @hierarchy ||= begin
                     filename = File.join(File.dirname(__FILE__), "..", "..", "hierarchy.yml")
                     YAML.load(File.read(filename))
                   end
  end

  def position
    @position ||= begin
                    position = []
                    tree = self.class.hierarchy
                    parts = raw_filename.split("/")
                    parts.each do |p|
                      node = tree.find do |t|
                        (t.is_a?(Hash) && t.has_key?(p)) || t == p
                      end
                      if node.nil?
                        raise "Cannot find #{raw_filename.inspect} in hierarchy"
                      end
                      position << tree.index(node)
                      tree = node[p] if node.is_a?(Hash)
                    end
                    position
                  end
  end
end
