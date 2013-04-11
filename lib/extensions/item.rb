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
end
