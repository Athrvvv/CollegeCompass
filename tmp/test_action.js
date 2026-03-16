const { getDiscoveryMeta } = require('./app/actions/getDiscoveryMeta');

async function test() {
  try {
    const meta = await getDiscoveryMeta();
    console.log("Discovery Meta Keys:", Object.keys(meta));
    console.log("Streams Count:", meta.streams.length);
    console.log("Specializations Count:", meta.specializations.length);
    console.log("Exams Count:", meta.exams.length);
    if (meta.streams.length > 0) console.log("Example Stream:", meta.streams[0]);
  } catch (e) {
    console.error("Action Test Failed:", e.message);
  }
}

test();
