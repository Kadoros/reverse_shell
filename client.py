from vidstream import ScreenShareClient

sender = ScreenShareClient("127.0.0.1",11111)

sender.start_stream()