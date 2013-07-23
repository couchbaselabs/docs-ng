cd /Users/kzeller/Couchbase_docs/docs
git pull

cd /Users/kzeller/Couchbase_docs/docs/Couchbase/products/couchbase/couchbase-manual-1.8
make depend
make validate
make reformat
make couchbase-manual.xml
cd ~/Desktop/docs-ng/
mkdir content/couchbase-manual-1.8
java -jar ~/Desktop/throwdown.jar /Users/kzeller/Couchbase_docs/docs/Couchbase/products/couchbase/couchbase-manual-1.8/couchbase-manual-ready.xml couchbase-manual-1.8

cd /Users/kzeller/Couchbase_docs/docs/Couchbase/products/couchbase/couchbase-manual-2.0
make depend
make validate
make reformat
make couchbase-manual.xml
cd ~/Desktop/docs-ng/
mkdir content/couchbase-manual-2.0
java -jar ~/Desktop/throwdown.jar /Users/kzeller/Couchbase_docs/docs/Couchbase/products/couchbase/couchbase-manual-2.0/couchbase-manual-ready.xml couchbase-manual-2.0

cd /Users/kzeller/Couchbase_docs/docs/Couchbase/products/couchbase/couchbase-manual-2.1.0
make depend
make validate
make reformat
make couchbase-manual.pdf
cd ~/Desktop/docs-ng/
mkdir content/couchbase-manual-2.1
java -jar ~/Desktop/throwdown.jar /Users/kzeller/Couchbase_docs/docs/Couchbase/products/couchbase/couchbase-manual-2.1.0/couchbase-manual-ready.xml couchbase-manual-2.1

cd /Users/kzeller/Couchbase_docs/docs/Couchbase/products/couchbase/couchbase-manual-2.2
make depend
make validate
make reformat
make couchbase-manual.xml
cd ~/Desktop/docs-ng/
mkdir content/couchbase-manual-2.2
java -jar ~/Desktop/throwdown.jar /Users/kzeller/Couchbase_docs/docs/Couchbase/products/couchbase/couchbase-manual-2.2/couchbase-manual-ready.xml couchbase-manual-2.2


cd /Users/kzeller/Couchbase_docs/docs/Couchbase/products/couchbase/couchbase-devguide-1.8
make depend
make validate
make reformat
make couchbase-devguide.xml
cd ~/Desktop/docs-ng/
mkdir content/couchbase-devguide-1.8
java -jar ~/Desktop/throwdown.jar /Users/kzeller/Couchbase_docs/docs/Couchbase/products/couchbase/couchbase-devguide-1.8/couchbase-devguide-ready.xml couchbase-devguide-1.8

cd /Users/kzeller/Couchbase_docs/docs/Couchbase/products/couchbase/couchbase-devguide-2.0
make depend
make validate
make reformat
make couchbase-devguide.xml
cd ~/Desktop/docs-ng/
mkdir content/couchbase-devguide-2.0
java -jar ~/Desktop/throwdown.jar /Users/kzeller/Couchbase_docs/docs/Couchbase/products/couchbase/couchbase-devguide-2.0/couchbase-devguide-ready.xml couchbase-devguide-2.0

cd /Users/kzeller/Couchbase_docs/docs/Couchbase/products/couchbase/couchbase-devguide-2.1.0
make depend
make validate
make reformat
make couchbase-devguide.xml
cd ~/Desktop/docs-ng/
mkdir content/couchbase-devguide-2.1
java -jar ~/Desktop/throwdown.jar /Users/kzeller/Couchbase_docs/docs/Couchbase/products/couchbase/couchbase-devguide-2.1.0/couchbase-devguide-ready.xml couchbase-devguide-2.1

cd /Users/kzeller/Couchbase_docs/docs/Couchbase/products/couchbase/couchbase-devguide-2.2
make depend
make validate
make reformat
make couchbase-devguide.xml
cd ~/Desktop/docs-ng/
mkdir content/couchbase-devguide-2.2
java -jar ~/Desktop/throwdown.jar /Users/kzeller/Couchbase_docs/docs/Couchbase/products/couchbase/couchbase-devguide-2.2/couchbase-devguide-ready.xml couchbase-devguide-2.2


cd /Users/kzeller/Couchbase_docs/docs/Couchbase/products/couchbase/couchbase-sdk-java-1.0
make depend
make validate
make reformat
make couchbase-sdk-java.xml
cd ~/Desktop/docs-ng/
mkdir content/couchbase-sdk-java-1.0
java -jar ~/Desktop/throwdown.jar /Users/kzeller/Couchbase_docs/docs/Couchbase/products/couchbase/couchbase-sdk-java-1.0/couchbase-sdk-java-ready.xml couchbase-sdk-java-1.0

cd /Users/kzeller/Couchbase_docs/docs/Couchbase/products/couchbase/couchbase-sdk-java-1.1
make depend
make validate
make reformat
make couchbase-sdk-java.xml
cd ~/Desktop/docs-ng/
mkdir content/couchbase-sdk-java-1.1
java -jar ~/Desktop/throwdown.jar /Users/kzeller/Couchbase_docs/docs/Couchbase/products/couchbase/couchbase-sdk-java-1.1/couchbase-sdk-java-ready.xml couchbase-sdk-java-1.1

cd /Users/kzeller/Couchbase_docs/docs/Couchbase/products/couchbase/couchbase-sdk-java-1.2
make depend
make validate
make reformat
make couchbase-sdk-java.xml
cd ~/Desktop/docs-ng/
mkdir content/couchbase-sdk-java-1.2
java -jar ~/Desktop/throwdown.jar /Users/kzeller/Couchbase_docs/docs/Couchbase/products/couchbase/couchbase-sdk-java-1.2/couchbase-sdk-java-ready.xml couchbase-sdk-java-1.2

cd /Users/kzeller/Couchbase_docs/docs/Couchbase/products/couchbase/couchbase-elastic-search
make depend
make validate
make reformat
make couchbase-elasticguide.pdf
cd ~/Desktop/docs-ng/
mkdir content/couchbase-elastic-search
java -jar ~/Desktop/throwdown.jar /Users/kzeller/Couchbase_docs/docs/Couchbase/products/couchbase/couchbase-elastic-search/couchbase-elasticguide-ready.xml couchbase-elastic-search


cd /Users/kzeller/Couchbase_docs/docs/Couchbase/products/couchbase/couchbase-sdk-c-1.0
make depend
make validate
make reformat
make couchbase-sdk-c.xml
cd ~/Desktop/docs-ng/
mkdir content/couchbase-sdk-c-1.0
java -jar ~/Desktop/throwdown.jar /Users/kzeller/Couchbase_docs/docs/Couchbase/products/couchbase/couchbase-sdk-c-1.0/couchbase-sdk-c-ready.xml couchbase-sdk-c-1.0

cd /Users/kzeller/Couchbase_docs/docs/Couchbase/products/couchbase/couchbase-sdk-c-2.0
make depend
make validate
make reformat
make couchbase-sdk-c.xml
cd ~/Desktop/docs-ng/
mkdir content/couchbase-sdk-c-2.0
java -jar ~/Desktop/throwdown.jar /Users/kzeller/Couchbase_docs/docs/Couchbase/products/couchbase/couchbase-sdk-c-2.0/couchbase-sdk-c-ready.xml couchbase-sdk-c-2.0

cd /Users/kzeller/Couchbase_docs/docs/Couchbase/products/couchbase/couchbase-sdk-c-2.1
make depend
make validate
make reformat
make couchbase-sdk-c.xml
cd ~/Desktop/docs-ng/
mkdir content/couchbase-sdk-c-2.1
java -jar ~/Desktop/throwdown.jar /Users/kzeller/Couchbase_docs/docs/Couchbase/products/couchbase/couchbase-sdk-c-2.1/couchbase-sdk-c-ready.xml couchbase-sdk-c-2.1

cd /Users/kzeller/Couchbase_docs/docs/Couchbase/products/couchbase/couchbase-sdk-net-1.0
make depend
make validate
make reformat
make couchbase-sdk-net.xml
cd ~/Desktop/docs-ng/
mkdir content/couchbase-sdk-net-1.0
java -jar ~/Desktop/throwdown.jar /Users/kzeller/Couchbase_docs/docs/Couchbase/products/couchbase/couchbase-sdk-net-1.0/couchbase-sdk-net-ready.xml couchbase-sdk-net-1.0


cd /Users/kzeller/Couchbase_docs/docs/Couchbase/products/couchbase/couchbase-sdk-net-1.1
make depend
make validate
make reformat
make couchbase-sdk-net.xml
cd ~/Desktop/docs-ng/
rm -rf content/couchbase-sdk-net-1.1
mkdir content/couchbase-sdk-net-1.1
java -jar ~/Desktop/throwdown.jar /Users/kzeller/Couchbase_docs/docs/Couchbase/products/couchbase/couchbase-sdk-net-1.1/couchbase-sdk-net-ready.xml couchbase-sdk-net-1.1

cd /Users/kzeller/Couchbase_docs/docs/Couchbase/products/couchbase/couchbase-sdk-net-1.2
make depend
make validate
make reformat
make couchbase-sdk-net.xml
cd ~/Desktop/docs-ng/
mkdir content/couchbase-sdk-net-1.2
java -jar ~/Desktop/throwdown.jar /Users/kzeller/Couchbase_docs/docs/Couchbase/products/couchbase/couchbase-sdk-net-1.2/couchbase-sdk-net-ready.xml couchbase-sdk-net-1.2


cd /Users/kzeller/Couchbase_docs/docs/Couchbase/products/couchbase/couchbase-sdk-php-1.0
make depend
make validate
make reformat
make couchbase-sdk-php.xml
cd ~/Desktop/docs-ng/
mkdir content/couchbase-sdk-php-1.0
java -jar ~/Desktop/throwdown.jar /Users/kzeller/Couchbase_docs/docs/Couchbase/products/couchbase/couchbase-sdk-php-1.0/couchbase-sdk-php-ready.xml couchbase-sdk-php-1.0

cd /Users/kzeller/Couchbase_docs/docs/Couchbase/products/couchbase/couchbase-sdk-php-1.1
make depend
make validate
make reformat
make couchbase-sdk-php.xml
cd ~/Desktop/docs-ng/
mkdir content/couchbase-sdk-php-1.1
java -jar ~/Desktop/throwdown.jar /Users/kzeller/Couchbase_docs/docs/Couchbase/products/couchbase/couchbase-sdk-php-1.1/couchbase-sdk-php-ready.xml couchbase-sdk-php-1.1

cd /Users/kzeller/Couchbase_docs/docs/Couchbase/products/couchbase/couchbase-sdk-ruby-1.0
make depend
make validate
make reformat
make couchbase-sdk-ruby.xml
cd ~/Desktop/docs-ng/
mkdir content/couchbase-sdk-ruby-1.0
java -jar ~/Desktop/throwdown.jar /Users/kzeller/Couchbase_docs/docs/Couchbase/products/couchbase/couchbase-sdk-ruby-1.0/couchbase-sdk-ruby-ready.xml couchbase-sdk-ruby-1.0

cd /Users/kzeller/Couchbase_docs/docs/Couchbase/products/couchbase/couchbase-sdk-ruby-1.1
make depend
make validate
make reformat
make couchbase-sdk-ruby.xml
cd ~/Desktop/docs-ng/
mkdir content/couchbase-sdk-ruby-1.1
java -jar ~/Desktop/throwdown.jar /Users/kzeller/Couchbase_docs/docs/Couchbase/products/couchbase/couchbase-sdk-ruby-1.1/couchbase-sdk-ruby-ready.xml couchbase-sdk-ruby-1.1

cd /Users/kzeller/Couchbase_docs/docs/Couchbase/products/couchbase/couchbase-sdk-ruby-1.2
make depend
make validate
make reformat
make couchbase-sdk-ruby.xml
cd ~/Desktop/docs-ng/
mkdir content/couchbase-sdk-ruby-1.2
java -jar ~/Desktop/throwdown.jar /Users/kzeller/Couchbase_docs/docs/Couchbase/products/couchbase/couchbase-sdk-ruby-1.2/couchbase-sdk-ruby-ready.xml couchbase-sdk-ruby-1.2

cd /Users/kzeller/Couchbase_docs/docs/Couchbase/products/couchbase/couchbase-sdk-ruby-1.3
make depend
make validate
make reformat
make couchbase-sdk-ruby.xml
cd ~/Desktop/docs-ng/
mkdir content/couchbase-sdk-ruby-1.3
java -jar ~/Desktop/throwdown.jar /Users/kzeller/Couchbase_docs/docs/Couchbase/products/couchbase/couchbase-sdk-ruby-1.3/couchbase-sdk-ruby-ready.xml couchbase-sdk-ruby-1.3

cd /Users/kzeller/Couchbase_docs/docs/Couchbase/products/couchbase/couchbase-sdk-python-1.0
make depend
make validate
make reformat
make couchbase-sdk-python.pdf
cd ~/Desktop/docs-ng/
mkdir content/couchbase-sdk-python-1.0
java -jar ~/Desktop/throwdown.jar /Users/kzeller/Couchbase_docs/docs/Couchbase/products/couchbase/couchbase-sdk-python-1.0/couchbase-sdk-python-ready.xml couchbase-sdk-python-1.0


cd /Users/kzeller/Couchbase_docs/docs/Couchbase/products/couchbase/hadoop-plugin
make depend
make validate
make reformat
make hadoop-plugin.xml
cd ~/Desktop/docs-ng/
mkdir content/hadoop-plugin
java -jar ~/Desktop/throwdown.jar /Users/kzeller/Couchbase_docs/docs/Couchbase/products/couchbase/hadoop-plugin/hadoop-plugin-ready.xml hadoop-plugin

cd /Users/kzeller/Couchbase_docs/docs/Couchbase/products/couchbase/hadoop-plugin-1.1
make depend
make validate
make reformat
make hadoop-plugin.xml
cd ~/Desktop/docs-ng/
mkdir content/hadoop-plugin-1.1
java -jar ~/Desktop/throwdown.jar /Users/kzeller/Couchbase_docs/docs/Couchbase/products/couchbase/hadoop-plugin-1.1/hadoop-plugin-ready.xml hadoop-plugin-1.1

cd /Users/kzeller/Couchbase_docs/docs/Couchbase/products/couchbase/couchbase-sdk-python-1.0
make depend
make validate
make reformat
make couchbase-sdk-python.xml
cd ~/Desktop/docs-ng/
mkdir content/hadoop-plugin-1.1
java -jar ~/Desktop/throwdown.jar /Users/kzeller/Couchbase_docs/docs/Couchbase/products/couchbase/couchbase-sdk-python-1.0/couchbase-sdk-python-ready.xml couchbase-sdk-python-1.0

cd /Users/kzeller/Couchbase_docs/docs/Couchbase/products/moxi/moxi-manual-1.7
make depend
make validate
make reformat
make moxi-manual.xml
cd ~/Desktop/docs-ng/
mkdir content/moxi-manual-1.7
java -jar ~/Desktop/throwdown.jar /Users/kzeller/Couchbase_docs/docs/Couchbase/products/moxi/moxi-manual-1.7/moxi-manual-ready.xml moxi-manual-1.7

cd /Users/kzeller/Couchbase_docs/docs/Couchbase/products/moxi/moxi-manual-1.8
make depend
make validate
make reformat
make couchbase-sdk-essentials.xml
cd ~/Desktop/docs-ng/
mkdir content/moxi-manual-1.8
java -jar ~/Desktop/throwdown.jar /Users/kzeller/Couchbase_docs/docs/Couchbase/products/moxi/moxi-manual-1.8/moxi-manual-ready.xml moxi-manual-1.8

cd /Users/kzeller/Couchbase_docs/docs-lang/ja/current/couchbase-manual-2.0


cd ~/Desktop/docs-ng/


