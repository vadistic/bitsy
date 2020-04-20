# bitsy-nosql-bucket

> Bitsy data store API for backendless prototyping

> bitsy
> _in British English_
> (ˈbɪtsɪ)
> ADJECTIVE
> Word forms: bitsier or bitsiest
> informal
> very small

## Start

```

# create bucket with first item
$curl -X POST "https://bitsy-nosql-bucket.herokuapp.com/api/buckets/new" \
  -H "accept: application/json"  \
  -H "Content-Type: application/json" \
  -d "{\"hello\":\"bitsy\"}"

# query bucket
curl -i GET "https://bitsy-nosql-bucket.herokuapp.com/api/buckets/mighty-moccasin-aphid-72"

# query all items
curl -i GET "https://bitsy-nosql-bucket.herokuapp.com/api/buckets/mighty-moccasin-aphid-72/items"


```

## Documentation

[Swagger docs](https://bitsy-nosql-bucket.herokuapp.com/)

Tiny rest api for persisting of arbitrary data.
