# ptcgo-dex

Pokémon TCG Online item data and business logic. Powered by malie.io.

## Documentation

Documentation pending. Read the [code](src) and view the [data files](data). [Source data](sources) from malie.io are provided as well, primarily for diffs.

### Data

- data/
  - expansions.json: Expansion data. Included by the source code for `ExpansionDefinition`s.
  - families.json: Family ID -> Name. Refers to the "family" property in Pokemon card definitions.
  - item-map.json: PTCGO archetype ID -> itemid
  - itemlist.json: Array of all itemids that have a definition.
  - items.json: Itemid -> Item definition
  - productlist.json: Array of all product assetids that have a definition.
  - ptcgo-set-map.json: PTCGO set key -> Expansion code. Useful when dealing with code that interacts with PTCGO internals.
  - expansion/[ExpansionCode].json: Item, pack, and product definitions per expansion (and PTCGO NoSet items, such as bundles).

## Versioning

\[semver-major].\[year 2-digit][week number].patch

## Updates

`gulp dex` updates the data. Git takes care of diffs. Check the output as well as the diff. Update the version accordingly.

`npm run build` builds the src/ typescript files.

`npm run test` runs lint and tests.

## License

[Unlicense](LICENSE)
