module github.com/johnkristianf/clamscanner

go 1.22.1

require (
	github.com/go-redis/redis/v8 v8.11.5
	github.com/golang-jwt/jwt/v5 v5.2.1
	github.com/gorilla/websocket v1.5.1
	github.com/johnkristanf/clamscanner v0.0.0-00010101000000-000000000000
	github.com/joho/godotenv v1.5.1
	github.com/rs/cors v1.10.1
	github.com/stretchr/testify v1.9.0
	golang.org/x/crypto v0.21.0
	gorm.io/driver/postgres v1.5.7
	gorm.io/gorm v1.25.8
)

require (
	github.com/cespare/xxhash/v2 v2.2.0 // indirect
	github.com/davecgh/go-spew v1.1.1 // indirect
	github.com/dgryski/go-rendezvous v0.0.0-20200823014737-9f7001d12a5f // indirect
	github.com/jackc/pgpassfile v1.0.0 // indirect
	github.com/jackc/pgservicefile v0.0.0-20231201235250-de7065d80cb9 // indirect
	github.com/jackc/pgx/v5 v5.5.5 // indirect
	github.com/jackc/puddle/v2 v2.2.1 // indirect
	github.com/jinzhu/inflection v1.0.0 // indirect
	github.com/jinzhu/now v1.1.5 // indirect
	github.com/pmezard/go-difflib v1.0.0 // indirect
	github.com/stretchr/objx v0.5.2 // indirect
	golang.org/x/net v0.21.0 // indirect
	golang.org/x/sync v0.6.0 // indirect
	golang.org/x/text v0.14.0 // indirect
	gopkg.in/yaml.v3 v3.0.1 // indirect
)

replace github.com/johnkristanf/clamscanner => ./
