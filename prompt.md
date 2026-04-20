Hey, bootstrap a react project, the aim is to use Lalachievement api to make a collectable list (mounts or minions) to gather

The UI should allow to add characters (fetch with /api/charcache/:id) (store the char ids in local storage for next sessions) 
Main component of the UI should be a table showing either mounts (/api/game/:lang/mounts) or minions (/api/game/:lang/minions) make sure to include the returned metadata, for each added char, it should show if the char owns the collectable, add a column counting how many people do not have the collectable, table should allow to order by and filter out, a very important metadata of the collectable is the "sourceTypeId" make sure to render them to the name of the source (you can use https://lalachievements.com/api/game/schema to check which routes are usable with /api/game/:lang/:table)
For the table component import a package that fits the requirement 

Here's the documentation of lalachievement api
Game Data

Game data endpoints are tightly integrated to the frontend's requirements, and thus you may have a better time obtaining your data elsewhere (XIVAPI, SaintCoinach, etc). However, they are still available to use. Column names and IDs are usually similar to the names used in other APIs.

 

/api/game/schema

This lists the endpoints available, with the list of values you can expect within each.

 

/api/game/:lang/:table

Cacheable version of the below endpoint. In most scenarios, you will use this version.

 

/api/game/:lang/:table/:since

This retrieves one or more tables of data. Not cacheable.

    lang - one of "en", "fr", "de", "ja". Affects the language of all values listed under "langKeys" in the schema.
    table - comma separated list of table names, or "all".
    since - unix timestamp, only data that has been modified after this date will be returned. Optional. Milliseconds.

Cards (experimental)

These are PNG image endpoints summarizing various data on the site. All of these follow the same format. Do not save or crawl these, you should hotlink to them and they will be generated on demand. Examples:

    https://lalachievements.com/en/char/11901583.png

Characters (old)

Requests providing a valid API key consume 0 points.

    /api/charcache/:id - Cached data, consumes 0 points.
    /api/charrealtime/:id - Consumes 5 points and syncs the character with Lodestone before returning data.
    /api/charprofile/:id - Deprecated.
    /api/charsearch/:text - Consumes 3 points. Searches only the Lalachievements database, not Lodestone.