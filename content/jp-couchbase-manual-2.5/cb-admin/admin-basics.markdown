<a id="couchbase-admin-basics"></a>

# アドミンについて

この章では、CouchbaseのSeverのクラスタ管理について解説します。
アドミンはは3つの方法で行うことができます。

 * **Couchbase Webコンソール**

　　CouchbaseにはビルトインのWebサーバーと管理インターフェイスが含まれ、クラスタに関するアドミンと統計情報を提供します。
   
　　詳細については、[Couchbase Webコンソール](#couchbase-admin-web-console)を参照してください。

 * **コマンドラインツールキット**

　　Couchbaseのパッケージにはいくつかのコマンドラインツールが含まれ、クラスタの管理やコミュニケーションをサポートします。

　　詳細については[コマンドライン インターフェース](../cb-cli/#couchbase-admin-cmdline)を参照してください。

 * **Couchbase REST API**
 
　　Couchbase ServerにはRESTful APIが含まれ、HTTPを介してクラスタの管理と監視をすることができます。

   詳細については [REST API](../cb-rest-api/#couchbase-admin-restapi)を参照してください。

 * **ベストプラクティス**

　　Couchbase Serverクラスタの構築、運用についての事例は[ベストプラクティス（事例）](#couchbase-bestpractice)、更に詳細については[運用ストラテジ](#couchbase-deployment)を参照してください。


既にmemcachedのプロトコルでアプリケーションを運用または開発している場合、memcachedをつなげるのと同様にアプリケーションをCouchbase Serverに容易につなぎ直すことができます。
その際コードの変更や特別なライブラリを必要とせず、memcachedとつなげている時と同様に正確に動作します。
クライアント側ではmemcachedとcouchbaseの入れ替えについて認識する必要がなく、データの永続化および複製が行われ、クラスタの拡張または縮小を透過的に行うことができます。

memcachedのプロトコルを使用すたアプリケーションを運用または開発していない場合、Couchbaseのクライアントライブラリをサーバに接続して情報を改めて格納します。詳細については[Couchbase 
SDK](http://www.couchbase.com/develop)を参照してください。

<a id="couchbase-data-files"></a>


## Couchbase データファイル

Couchbase Serverはデフォルトで下記のパスを通じてデータを格納します。

Platform | Directory                                                       
---------|-----------------------------------------------------------------
Linux    | `/opt/couchbase/var/lib/couchbase/data`                         
Windows  | `C:\Program Files\couchbase\server\var\lib\couchbase\data`      
Mac OS X | `~/Library/Application Support/Couchbase/var/lig/couchbase/data`


このパスは格ノードの設定時にWeb UIセットアップウィザード[REST API](../cb-rest-api/#couchbase-admin-restapi)またはCouchbase CLIから変更することができます。


<div class="notebox warning">
<p>警告</p>
<p>クラスタの一部であるノードのパスを変更した場合、ディスクに永続化されたデータを削除することになりますのでご注意ください。</p>
</div>

Linux:


```
> couchbase-cli node-init -c node_IP:8091 \
    --node-init-data-path=new_path \
    -u user -p password
```

Windows:


```
> couchbase-cli node-init -c \
    node_IP:8091 --node-init-data-path=new_path \
    -u user -p password
```

<div class="notebox">
<p>備考</p>
<p>コマンドラインツールを使用の際、データファイルの変更やインデックスファイルのパスの設定を個別に行うことができません。
データファイルの設定とインデックスファイルのパスを個別に行う場合、REST APIを使用してください。詳細については
<a href=../cb-rest-api/#couchbase-admin-restapi-provisioning-diskpath>インデックスパスの設定
</a>をご参照ください。</p>
</div>


一度ノードまたはクラスタの設定されデータが格納されると、ノードが実行中のクラスタの一部である間はパスを変更することはできません。
クラスタからノードを削除する場合、以下の手順に従う必要があります。

 
1. [REST APIで稼働中のノードに対するパスを変更](../cb-rest-api/#couchbase-admin-restapi) またはCouchbase CLI(上記コマンドを参照)を使用します。 パスの変更はノードを再起動するまで有効となりません。クラスタからノードを排出するためのREST API要求を使用する方法の詳細については、
    [クラスタからノードを削除する](../cb-rest-api/#couchbase-admin-restapi-remove-node-from-cluster)を参照してください。

 1. ノードを停止します。

 1. 全てのデータを移行先にコピーします。

 1. [サービスの再起動と監視](#couchbase-monitoring) データのウォームアップ


<a id="couchbase-admin-basics-running"></a>

## サーバーの起動および停止

Couchbase Serverの設定には、ネイティブブートと停止メカニズムを使用した自動的にサーバの開始および停止する機能が含まれています。

Couchbaseの起動と停止について詳細は格プラットフォームの使用方法をを参照してください。

　* [Linuxで起動と停止](#couchbase-admin-basics-running-linux)

　* [Windowsで起動と停止](#couchbase-admin-basics-running-windows)

　* [Mac OS Xで起動と停止](#couchbase-admin-basics-running-macosx)

<a id="couchbase-admin-basics-running-linux"></a>

### Linuxで起動と停止

Couchbase ServerをLinux上に起動時にバックグラウンド（デーモン）プロセスとして実行するためのサポートを持つスタンドアロンのアプリケーションとしてインストールされます。
起動スクリプトはインストール時にLinuxのパッケージ（Debian/ UbuntuまたはRed Hat / CentOSの）の中から自動的にインストールされます。
デフォルト設定によりCouchbase Serverは実行レベル2、3、4、5、およびランレベル0,1、および6でシャットダウン時に自動的に起動するように構成されています。

起動と停止スクリプトを使用してCouchbase Serverを手動で起動するには、次のスクリプトを参考にしてください。

```
> sudo /etc/init.d/couchbase-server start
```

起動と停止スクリプトを使用してCouchbase Serverを手動で停止するには、次のスクリプトを参考にしてください。

```
> sudo /etc/init.d/couchbase-server stop
```

<a id="couchbase-admin-basics-running-windows"></a>

### Windowsで起動と停止

WindowsではCouchbase ServerはWindowsのサービスとしてインストールされます。
Couchbase Serverを起動または停止させるには、Windowsタスクマネージャ内の ”サービス”タブを使用することができます。

<div class="notebox">
<p>備考</p>
<p>パワーユーザーや管理者権限が必要、または個別のCouchbase Serverを起動および停止するサービスを管理する権利を付与される必要があります。</p>
</div>


サービスの起動はデフォルト設定によってマシンのブート時に自動的に行われます。
サービスを手動で開始するには、Windowsタスクマネージャを開き、”サービス”タブを選択するか、”開始”タブ選択後に”実行”を選択して、”services.msc”と入力して管理コンソールを開きます。

一度開いて、”CouchbaseServer”を確認した後、右クリックし、必要に応じてサービスを起動または停止します。
また、ブート時にサービスが自動的に起動時しないよう設定を変更することができます。

別の方法としては、コマンドラインから”NET ”コマンドを使用するなどして、サービスを開始および停止することができます。例えば次のようにしてCouchbase Serverを起動させることができます。


```
> net start CouchbaseServer
```

Couchbase Serverを停止させるには次のコマンドを使用します。


```
> net stop CouchbaseServer
```

起動と停止のスクリプトは通常のCouchbase Serverインストール時のビン内のディレクトリより提供されています。
この方法を利用する場合は次のコマンドを参考にしてください。


```
> C:\Program Files\Couchbase\Server\bin\service_start.bat
```

提供されているスクリプトを使ってCouchbase Serverを停止するには次のスクリプトを使用します。


```
> C:\Program Files\Couchbase\Server\bin\service_stop.bat
```

<a id="couchbase-admin-basics-running-macosx"></a>

### Mac OS Xで起動と停止

Mac OS XでCouchbase Serverは標準アプリケーションとして提供されており、アプリケーションをダブルクリックしてCouchbase Serverを起動することができます。
Couchbase Serverはバックグラウンドアプリケーションとして実行され、サーバーを制御できるメニューバーをインストールします。 


![](../images/macosx-menubar.png)

The individual menu options perform the following actions:
メニューの格オプションは次の操作で実行されます。

* `Couchbaseについて`

　　インストールしたCouchbase Serverのライセンスおよびバージョン情報を含むダイアログを開きます。

* `アドミンコンソールを開く`
   
　　ブラウザでWeb管理コンソールを開きます。

 * `サポートフォーラム`

   Couchbase ServerのWebサイトに掲載されているサポートフォーラムを開きます。ここでは他のユーザやCouchbaseの開発者に質問をすることができます。

 * `バージョン更新の確認`

   最新のバージョンに更新されたか確認します。この手順は、現在インストールされているバージョンをチェックし、新しいバージョンをダウンロードおよびインストールするための確認となります。新バージョンが公開されている場合は、新しいリリースについての情報を含むダイアログが表示されます。

  新バージョンが提供されている場合、更新を保留し後日アップデートの通知をしたり、自動的に新しいバージョンにアップデートすることができます。


   もし自動更新を選択した場合、最新バージョンがダウンロードが行われ、インストールの許可を求められます。
インストールが行われると既存のCouchbase Serverが停止されるため、最新バージョンをインストールし、完了した後にサービスを再起動します。

   インストールが完了すると、今後も自動的にCouchbase Serverの更新するかどうかを質問されます。

   
 <div class="notebox">
   <p>備考</p>
   <p>バージョン更新機能を使用すると、現在使用しているCouchbase Serverとクラスタの匿名データが当社内部に送信されます。この情報は、当社のサービスの提供を改善するために使用されます。</p>
   </div>


   また `Automatically download and install updates in the future（今後自動的にアップデートする）`のチェックボックスを選択すると、自動更新を有効にすることができます。
また、メニュー項目を選択すると選択が切り替わります。

* `Launch Admin Console at Start（起動時にアドミンコンソールを開始）`

このメニュー項目にチェックを入れると、Couchbase Serverが起動される際に管理コンソールが開くようになります。
また、メニュー項目を選択すると選択が切り替わります。

 * `Automatically Start at Login（ログイン時の自動起動）`

このメニューにチェックを入れると、Mac OS Xを起動した際にCouchbase Serverが自動的に起動します。
メニュー項目を選択すると選択が切り替わります。

 * `Couchbaseの停止`

このメニューにチェックを入れると、実行中のCouchbase Serverを終了し、メニューバーのインターフェイスを閉じます。
再起動するには、インストールフォルダからのCouchbase Serverアプリケーションを開く必要があります。