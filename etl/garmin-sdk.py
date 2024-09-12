from garmin_fit_sdk import Decoder, Stream

stream = Stream.from_file("intervals.fit")
decoder = Decoder(stream)
messages, errors = decoder.read()

print(errors)
print(messages)