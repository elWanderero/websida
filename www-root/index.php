<?php
require($_SERVER['DOCUMENT_ROOT'] . "/php/DBconnect.php");

// Hämta alla poster ur databasen.
$query = "SELECT title, text, svg_image, DATE_FORMAT(date, '%y-%m-%d') as date FROM blogpost ORDER BY date DESC";
$result = $db_connection->query($query);

$posts = [];
while ($row = $result->fetch_assoc()) {
    $posts[] = $row;
}
// Loopen ovan ersätter det undre om mysqli::fetch_all inte finns på servern.
// $posts = $result->fetch_all(MYSQLI_ASSOC);

// För varje post, rendera html.
$total_post_html = "";
$is_first_post = true;
foreach ($posts as $post) {
  $title = $post['title'];
  $text = $post['text'];
  $svg = $post['svg_image'];
  $date = $post['date'];
  if (! (is_null($title) || is_null($date)) && ! (is_null($text) && is_null($svg)) ) {
    $svg_html = '';
    // Rendera SVG-html bara för poster i databasen med SVG.
    if (! is_null($svg)) {
      $svg_html = "<div class='svg_here' style='display:none' svg='".$svg."'></div><br>";
    }
    if (!$is_first_post) {
      $total_post_html .= '<hr>';
    }
    $is_first_post = false;
    $post_html =
      '<div class="post-preview">
        <h2 class="post-title">'.$title.'</h2>
        <p>'.$text.'</p>
        '.$svg_html.'
        <p class="post-meta">Postat '.$date.'</p>
      </div>';
    $total_post_html .= $post_html;
  }
}

?>

<!DOCTYPE html>
<html lang="sv">

<head>

    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">

    <title>SVG-blogg</title>

    <!-- Bootstrap Core CSS -->
    <link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">

    <!-- Theme CSS -->
    <link href="css/clean-blog.min.css" rel="stylesheet">

    <!-- Custom Fonts -->
    <link href="vendor/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css">
    <link href='https://fonts.googleapis.com/css?family=Lora:400,700,400italic,700italic' rel='stylesheet' type='text/css'>
    <link href='https://fonts.googleapis.com/css?family=Open+Sans:300italic,400italic,600italic,700italic,800italic,400,300,600,700,800' rel='stylesheet' type='text/css'>

    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
        <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
        <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->
    
    <!-- jQuery -->
    <!--script type="text/javascript" src="js/jquery.min.js"></script-->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
    <!-- Daniels script -->
    <link href="index/index.css" rel="stylesheet">
    <script type="text/javascript" src="index/index.js"></script>

</head>

<body>

    <!-- Navigation -->
    <nav class="navbar navbar-default navbar-custom navbar-fixed-top">
        <div class="container-fluid">
            <!-- Brand and toggle get grouped for better mobile display -->
            <div class="navbar-header page-scroll">
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                    <span class="sr-only">Toggle navigation</span>
                    Meny <i class="fa fa-bars"></i>
                </button>
                <a class="navbar-brand" href="index.php">SVG-blogg</a>
            </div>

            <!-- Collect the nav links, forms, and other content for toggling -->
            <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                <ul class="nav navbar-nav navbar-right">
                    <li>
                        <a href="index.php">Hem</a>
                    </li>
                    <li>
                        <a href="form1.html">Skriv inl&auml;gg v1.0</a>
                    </li>
                    <li>
                        <a href="form2.html">Skriv inl&auml;gg v2.0</a>
                    </li>
                </ul>
            </div>
            <!-- /.navbar-collapse -->
        </div>
        <!-- /.container -->
    </nav>

    <!-- Page Header -->
    <!-- Set your background image for this header on the line below. -->
    <header class="intro-header" style="background-image: url('index/index-bg.jpg')">
        <div class="container">
            <div class="row">
                <div class="col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1">
                    <div class="site-heading">
                        <h1>Min SVG-blogg</h1>
                        <hr class="small">
                        <span class="subheading">En blogg om en blogg av Daniel Zavala-Svensson</span>
                    </div>
                </div>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <div class="container">
        <div class="row">
            <div class="col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1">
                <?php echo $total_post_html; ?>
            </div>
        </div>
    </div>

    <hr>

    <!-- Footer -->
    <footer>
        <div class="container">
            <div class="row">
                <div class="col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1">
                    <p class="copyright text-muted">Copyright &copy; Daniel Zavala-Svensson 2018</p>
                </div>
            </div>
        </div>
    </footer>
    
    <!-- Bootstrap Core JavaScript -->
    <script src="vendor/bootstrap/js/bootstrap.min.js"></script>

    <!-- Theme JavaScript -->
    <script src="js/clean-blog.min.js"></script>

</body>

</html>
