package nmplay.tank1;

import java.net.URISyntaxException;

import com.github.nkzawa.emitter.Emitter;
import com.github.nkzawa.socketio.client.IO;
import com.github.nkzawa.socketio.client.Socket;

public class Tank1AppMain {

	/**
	 * main.
	 *
	 * @param args
	 * @throws URISyntaxException
	 */
	public static void main(String[] args) throws URISyntaxException {
		// TODO 自動生成されたメソッド・スタブ
		Socket socket = IO.socket("http://localhpost:3000");
		socket.emit("my event", "hi");
		socket.on("my event", new Emitter.Listener() {
			public void call(Object... args) {
				// TODO 自動生成されたメソッド・スタブ
			}
		});
	}
}
