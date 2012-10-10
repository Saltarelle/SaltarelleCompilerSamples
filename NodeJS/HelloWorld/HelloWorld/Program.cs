using NodeJS.HttpModule;

class Program {
	static void Main() {
		Http.CreateServer((req, res) => {
			res.Write("Hello, world");
			res.End();
		}).Listen(8000);
	}
}
