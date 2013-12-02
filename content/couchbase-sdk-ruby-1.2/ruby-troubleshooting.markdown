# Ruby — Troubleshooting

<a id="couchbase-sdk-ruby-timed-operations"></a>

## Creating Timed Operations

One approach you can try if you get temporary out of memory errors from the
server is to explicitly pace the timing of requests you make. You can do this in
any SDK by creating a timer and only perform a Couchbase request after a
specific timed interval. This will provide a slight delay between server
requests and will reduce the risk of an out of memory error. For instance in
Ruby:


```ruby
c.set("foo", 100)
n = 1

c.run do
    c.create_periodic_timer(500000) do |tm|
          c.incr("foo") do
              if n == 5
                  tm.cancel
              else
                  n += 1
              end
          end
    end
end
```

In this example we create a sample record `foo` with the initial fixnum value of
100. Then we create a increment count set to one, to indicate the first time we
will create a Couchbase request. In the event loop, we create a timing loop that
runs every.5 seconds until we have repeated the loop 5 times and our increment
is equal to 5. In the timer loop, we increment `foo` per loop.

<a id="couchbase-sdk-ruby-rn"></a>
